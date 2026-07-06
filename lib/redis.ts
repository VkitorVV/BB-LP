const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL!;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!;

async function redisCommand(command: unknown[]): Promise<unknown> {
  const res = await fetch(REDIS_URL, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`Redis error: ${res.status}`);
  const json = await res.json() as { result: unknown };
  return json.result;
}

export async function rIncr(key: string): Promise<void> {
  await redisCommand(['INCR', key]);
}

export async function rIncrExpire(key: string, ttlSeconds: number): Promise<void> {
  await redisCommand(['INCR', key]);
  await redisCommand(['EXPIRE', key, ttlSeconds]);
}

export async function rSet(key: string, value: string, ttlSeconds: number): Promise<void> {
  await redisCommand(['SET', key, value, 'EX', ttlSeconds]);
}

export async function rGet(key: string): Promise<string | null> {
  const result = await redisCommand(['GET', key]);
  return result as string | null;
}

export async function rGetInt(key: string): Promise<number> {
  const val = await rGet(key);
  return val ? parseInt(val, 10) : 0;
}

export async function rKeys(pattern: string): Promise<string[]> {
  const result = await redisCommand(['KEYS', pattern]);
  return (result as string[]) || [];
}

export async function rZIncrBy(key: string, increment: number, member: string, ttlSeconds: number): Promise<void> {
  await redisCommand(['ZINCRBY', key, increment, member]);
  await redisCommand(['EXPIRE', key, ttlSeconds]);
}

export async function rZRangeWithScores(key: string): Promise<{ member: string; score: number }[]> {
  const result = await redisCommand(['ZRANGE', key, '0', '-1', 'WITHSCORES']) as string[];
  if (!result || result.length === 0) return [];
  const pairs: { member: string; score: number }[] = [];
  for (let i = 0; i < result.length; i += 2) {
    pairs.push({ member: result[i], score: parseFloat(result[i + 1]) });
  }
  return pairs;
}

export async function rPipeline(commands: unknown[][]): Promise<unknown[]> {
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`Redis pipeline error: ${res.status}`);
  const json = await res.json() as { result: unknown }[];
  return json.map((r) => r.result);
}
