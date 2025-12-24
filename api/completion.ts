import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();

    const {
      anonymousUserId,
      challengeId,
      stepCount,
      instructionCount,
      executionMode,
      completedAt,
      clientVersion,
    } = body || {};

    // Minimal validation
    if (
      !anonymousUserId ||
      !challengeId ||
      typeof stepCount !== 'number' ||
      typeof instructionCount !== 'number' ||
      !executionMode ||
      !completedAt
    ) {
      return new Response(null, { status: 400 });
    }

    await pool.query(
      `
      INSERT INTO completion_events (
        anonymous_user_id,
        challenge_id,
        step_count,
        instruction_count,
        execution_mode,
        client_version,
        completed_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        anonymousUserId,
        challengeId,
        stepCount,
        instructionCount,
        executionMode,
        clientVersion || null,
        completedAt,
      ]
    );

    return new Response(null, { status: 204 });
  } catch {
    // Never break the frontend
    return new Response(null, { status: 204 });
  }
}
