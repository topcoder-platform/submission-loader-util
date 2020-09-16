const _ = require('lodash')
const fs = require('fs').promises
const config = require('config')
const submissionApi = require('@topcoder-platform/topcoder-submission-api-wrapper')

const submissionApiM2MClient = submissionApi(_.pick(config,
  ['AUTH0_URL', 'AUTH0_AUDIENCE', 'TOKEN_CACHE_TIME',
    'AUTH0_CLIENT_ID', 'AUTH0_CLIENT_SECRET', 'SUBMISSION_API_URL',
    'AUTH0_PROXY_SERVER_URL']))

async function createSubs () {
  const type = 'Contest Submission'
  const submissions = new Array()

  try {
    const challengesFile = await fs.readFile(`./data/${config.FILE_CHALLENGES}`)
    const data = JSON.parse(challengesFile.toString())
    console.log(JSON.stringify(data.challenges[0], null, ' '))

    _.forEach(data.challenges, async (c) => {
      // { url: 'https://tc-test-submission-scan.s3.amazonaws.com/good.zip', memberId: 23225544, challengeId: 30056738 }
      // 30141547&submissionId=397761
      _.forEach(c.submissions, async (s) => {
        _.forEach(s.submissions, async (r) => {
          const url = `https://${config.DOMAIN}/direct/contest/downloadSoftwareSubmission.action?projectId=${c.challengeId}&submissionId=${r.submissionId}`
          const sub = {
            url,
            type,
            memberId: s.submitterId,
            challengeId: c.challengeId
          }

          console.log(sub)
          /*
          try {
            // const rec = await submissionApiM2MClient.createSubmission(sub)
            // creata review for sub
            console.log(rec.body)
          } catch (e) {
            console.log(e)
          }
          */
        })
      })
    })
  } catch (e) {
    console.log(e)
  }
}

createSubs()
