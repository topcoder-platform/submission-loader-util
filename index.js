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
    const challengesFile = await fs.readFile(`./data/sample.json`) // await fs.readFile(`./data/${config.FILE_CHALLENGES}`)
    const data = JSON.parse(challengesFile.toString())
    const reviewerId = config.REVIEWER_ID
    const scoreCardId = config.SCORECARD_ID

    const typeIdBody = await submissionApiM2MClient.searchReviewTypes({
      page: 1,
      perPage: 1,
      name: 'Marathon Match Review',
      isActive: true
    }) // config.REVIEW_TYPE_ID 

    const typeId = typeIdBody.body[0].id
    const status = 'completed'
    const testType = 'provisional'
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
            challengeId: c.challengeId,
            submittedDate: r.submissionTime
          }

          console.log(sub)

          try {
            const recSub = await submissionApiM2MClient.createSubmission(sub)
            console.log(recSub.body)

            const review = {
              score: s.finalScore || 0.0,
              reviewerId,
              submissionId: recSub.id,
              reviewedDate: r.submissionTime,
              scoreCardId,
              typeId,
              status,
              metadata: {
                testType,
                public: s,
                private: {}
              }
            }
            const recReview = await submissionApiM2MClient.createReview(review)
            console.log('review: ', recReview.body)

          } catch (e) {
            console.log('ERROR:')
            console.log(e.text , (e.response && e.response.body) ,  e.message)
          }
        })
      })
    })
  } catch (e) {
    console.log(e)
  }
}

createSubs()
