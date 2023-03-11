import find from 'find-process'

// Allow the user to override detection if we can use colors
const forceColorEnv = process.env.FORCE_COLOR
export function isForcingColor() {
  if (forceColorEnv === '1' || forceColorEnv === 'true') return true
  return false
}

export async function isRunningAsTestChildProcess() {
  if (process.ppid == null) return false
  const procs = await find('pid', process.ppid)
  const proc = procs[0]
  return proc != null && proc.name === 'node' && proc.cmd.includes('--test')
}
