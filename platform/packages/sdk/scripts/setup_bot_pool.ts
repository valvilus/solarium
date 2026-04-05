import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";
import { AnchorProvider, Wallet, BN } from "@coral-xyz/anchor";
import { SolariumClient, NodeType } from "../src";

const POOL_SIZE = 2;
const DEVNET_URL = "https://api.devnet.solana.com";
const ROOT_DIR = path.resolve(__dirname, "../../../");
const MAIN_WALLET_PATH = path.join(ROOT_DIR, "core/keys/deployer-id.json");
const POOL_DIR = path.join(ROOT_DIR, "platform/apps/web/bot_pool");

async function main() {
  console.log("СТАРТ ИНИЦИАЛИЗАЦИИ БЕССМЕРТНОГО ПУЛА");
  const connection = new Connection(DEVNET_URL, "confirmed");

  const secret = JSON.parse(fs.readFileSync(MAIN_WALLET_PATH, "utf-8"));
  const deployerKp = Keypair.fromSecretKey(new Uint8Array(secret));
  const deployerWallet = new Wallet(deployerKp);

  console.log("Казначей:", deployerKp.publicKey.toBase58());
  const balance = await connection.getBalance(deployerKp.publicKey);
  console.log(`Баланс казны: ${balance / LAMPORTS_PER_SOL} SOL`);

  console.log(`Баланс казны: ${balance / LAMPORTS_PER_SOL} SOL`);

  if (!fs.existsSync(POOL_DIR)) {
    fs.mkdirSync(POOL_DIR, { recursive: true });
  }

  const deployerProvider = new AnchorProvider(connection, deployerWallet, { commitment: "confirmed" });
  const deployerClient = new SolariumClient(deployerProvider);
  try {
    await deployerClient.fetchProtocol();
    console.log("Протокол уже инициализирован.");
  } catch (e) {
    console.log("Инициализация протокола...");
    await deployerClient.initializeProtocol(deployerWallet.publicKey);
  }

  for (let i = 1; i <= POOL_SIZE; i++) {
    console.log(`\nНастройка Бота #${i}...`);
    const opFile = path.join(POOL_DIR, `op${i}.json`);
    const burnerFile = path.join(POOL_DIR, `burner${i}.json`);

    let operatorKp: Keypair;
    let burnerKp: Keypair;

    if (fs.existsSync(opFile) && fs.existsSync(burnerFile)) {
      operatorKp = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(opFile, "utf-8"))));
      burnerKp = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(burnerFile, "utf-8"))));
      console.log(`Ключи найдены. Оператор: ${operatorKp.publicKey.toBase58()}`);
    } else {
      operatorKp = Keypair.generate();
      burnerKp = Keypair.generate();
      fs.writeFileSync(opFile, JSON.stringify(Array.from(operatorKp.secretKey)));
      fs.writeFileSync(burnerFile, JSON.stringify(Array.from(burnerKp.secretKey)));
      console.log(`Сгенерированы новые ключи. Оператор: ${operatorKp.publicKey.toBase58()}`);
    }

    const opBalance = await connection.getBalance(operatorKp.publicKey);
    const burnerBalance = await connection.getBalance(burnerKp.publicKey);

    const stakeReq = i === 1 ? 1.5 : 0.5;
    const targetOpBalance = stakeReq * LAMPORTS_PER_SOL;

    let transferTx = new Transaction();
    let needsFunding = false;

    let targetInitialFunding = (stakeReq + 1.1) * LAMPORTS_PER_SOL;
    let alreadyExists = fs.existsSync(opFile);

    if (!alreadyExists && opBalance < targetInitialFunding) {
      const amountNeeded = targetInitialFunding - opBalance;
      transferTx.add(
        SystemProgram.transfer({
          fromPubkey: deployerKp.publicKey,
          toPubkey: operatorKp.publicKey,
          lamports: amountNeeded,
        })
      );
      needsFunding = true;
    }

    if (burnerBalance < 0.1 * LAMPORTS_PER_SOL) {
      const amountNeeded = 0.1 * LAMPORTS_PER_SOL - burnerBalance;
      transferTx.add(
        SystemProgram.transfer({
          fromPubkey: deployerKp.publicKey,
          toPubkey: burnerKp.publicKey,
          lamports: amountNeeded,
        })
      );
      needsFunding = true;
    }

    if (needsFunding) {
      console.log(`Переводим SOL на балансы Бота #${i}...`);
      const sig = await sendAndConfirmTransaction(connection, transferTx, [deployerKp]);
      console.log(`Успешно! Tx: ${sig}`);
    } else {
      console.log(`Бот #${i} уже достаточно богат.`);
    }

    const opWallet = new Wallet(operatorKp);
    const provider = new AnchorProvider(connection, opWallet, { commitment: "confirmed" });
    const client = new SolariumClient(provider);

    let isRegistered = false;
    try {
      const nodeState = await client.fetchNode(operatorKp.publicKey);
      console.log(`Бот #${i} уже зарегистрирован в блокчейне.`);
      isRegistered = true;
      if ((nodeState as any).freeStake.toNumber() < stakeReq * LAMPORTS_PER_SOL) {
        console.log(`Достейкинг ${stakeReq} SOL...`);
        await client.depositStake(new BN(stakeReq * LAMPORTS_PER_SOL));
      }
    } catch (e) {
      if (isRegistered) {
        console.error("Ошибка при стейкинге:", e);
        throw e;
      }
      console.log(`Регистрация Бота #${i} в смарт-контракте...`);
      const role = i === 1 ? NodeType.Worker : NodeType.Validator;

      await client.registerNode(burnerKp.publicKey, role, (i % 3) + 1);
      console.log(`Внесение залога (Stake) ${stakeReq} SOL...`);
      await client.depositStake(new BN(stakeReq * LAMPORTS_PER_SOL));
      console.log(`Бот #${i} полностью готов!`);
    }
  }
  console.log("\nПУЛ БОТОВ УСПЕШНО СОЗДАН И ГОТОВ К DEVNET ДЕМОНСТРАЦИИ!");
}

main().catch(console.error);
