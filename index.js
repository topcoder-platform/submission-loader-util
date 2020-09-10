const _ = require('lodash')
const config = require('config')

const submissionApiM2MClient = submissionApi(_.pick(config,
  ['AUTH0_URL', 'AUTH0_AUDIENCE', 'TOKEN_CACHE_TIME',
    'AUTH0_CLIENT_ID', 'AUTH0_CLIENT_SECRET', 'SUBMISSION_API_URL',
    'AUTH0_PROXY_SERVER_URL']))

async function createSubs() {

  const type = 'Contest Submission'
  const submissions = new Array()

  submissions[submissions.length] = { url: 'https://tc-test-submission-scan.s3.amazonaws.com/good.zip', memberId: 40493050, challengeId: 30054692}

  _.forEach(submissions, (s) => {
    const url = s.url

    const sub = {
      url,
      type,
      memberId: s.memberId,
      challengeId: s.challengeId
    }
  })

  await submissionApiM2MClient.createSubmission(sub)
}

createSubs()
