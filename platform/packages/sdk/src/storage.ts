import { sha256 } from "js-sha256";

export interface StorageProvider {
  uploadJson(data: unknown): Promise<{ uri: string; hashArray: number[] }>;
  downloadJson<T>(uri: string): Promise<T>;
}

export function hashJson(data: unknown): number[] {
  const jsonString = JSON.stringify(data);
  const hashHex = sha256(jsonString);
  const hashBytes = [];
  for (let i = 0; i < hashHex.length; i += 2) {
    hashBytes.push(parseInt(hashHex.substring(i, i + 2), 16));
  }
  return hashBytes;
}

export class PinataProvider implements StorageProvider {
  constructor(private readonly jwt: string) {}

  async uploadJson(data: unknown): Promise<{ uri: string; hashArray: number[] }> {
    const hashArray = hashJson(data);

    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const formData = new FormData();
    formData.append("file", blob, "manifest.json");

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Pinata upload failed: ${await res.text()}`);
    }

    const json = (await res.json()) as { IpfsHash: string };
    return { uri: `ipfs://${json.IpfsHash}`, hashArray };
  }

  async downloadJson<T>(uri: string): Promise<T> {
    const cid = uri.replace("ipfs://", "");
    const res = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
    if (!res.ok) {
      throw new Error(`Failed to download from Pinata: ${res.statusText}`);
    }
    return res.json() as Promise<T>;
  }
}

export class LocalStorageProvider implements StorageProvider {
  constructor(private readonly basePath: string = "./.storage") {}

  private async getFs() {
    try {
      return await import("fs/promises");
    } catch {
      throw new Error("Local filesystem storage is not supported in this environment.");
    }
  }

  async uploadJson(data: unknown): Promise<{ uri: string; hashArray: number[] }> {
    const fs = await this.getFs();
    const hashArray = hashJson(data);
    const hashHex = Buffer.from(hashArray).toString("hex");

    await fs.mkdir(this.basePath, { recursive: true });
    await fs.writeFile(`${this.basePath}/${hashHex}.json`, JSON.stringify(data));

    return { uri: `local://${hashHex}`, hashArray };
  }

  async downloadJson<T>(uri: string): Promise<T> {
    const fs = await this.getFs();
    const hashHex = uri.replace("local://", "");
    const content = await fs.readFile(`${this.basePath}/${hashHex}.json`, "utf-8");
    return JSON.parse(content) as T;
  }
}

export function createStorageProvider(jwt?: string): StorageProvider {
  return jwt ? new PinataProvider(jwt) : new LocalStorageProvider();
}
