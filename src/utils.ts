import find from 'find-process'

export async function isRunningAsTestChildProcess() {
  if (process.ppid == null) return false
  const procs = await find('pid', process.ppid)
  const proc = procs[0]
  return proc != null && proc.name === 'node' && proc.cmd.includes('--test')
}
