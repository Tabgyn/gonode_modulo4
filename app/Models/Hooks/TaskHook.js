'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/NewTaskMail')
const TaskHook = (exports = module.exports = {})

TaskHook.sendNewTaskMail = async modelInstance => {
  if (!modelInstance.user_id && !modelInstance.dirty.user_id) return

  const { email, username } = await modelInstance.user().fetch()
  const file = await modelInstance.file().fetch()
  const { title } = modelInstance

  Kue.dispatch(Job.key, { email, username, title, file }, { attempts: 3 })
}
