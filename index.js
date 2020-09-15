const _ = require('lodash')
const config = require('config')
const submissionApi = require('@topcoder-platform/topcoder-submission-api-wrapper')

const submissionApiM2MClient = submissionApi(_.pick(config,
  ['AUTH0_URL', 'AUTH0_AUDIENCE', 'TOKEN_CACHE_TIME',
    'AUTH0_CLIENT_ID', 'AUTH0_CLIENT_SECRET', 'SUBMISSION_API_URL',
    'AUTH0_PROXY_SERVER_URL']))

async function createSubs() {

  const type = 'Contest Submission'
  const submissions = new Array()

  submissions[submissions.length] = { url: 'https://tc-test-submission-scan.s3.amazonaws.com/good.zip', memberId: 23225544, challengeId: 30056738}

  _.forEach(submissions, async (s) => {
    const url = s.url

    const sub = {
      url,
      type,
      memberId: s.memberId,
      challengeId: s.challengeId
    }
    try {
      const rec = await submissionApiM2MClient.createSubmission(sub)
      console.log(rec.body)
    } catch (e) {
      console.log(e)
    }
    
  })
}

createSubs()
