import { GraphQLClient, gql } from 'graphql-request'

export default async function handler(request, response) {
  let body = JSON.parse(request.body)

  // TODO: Check for errors and return 400 with whats missing


  const client = new GraphQLClient("https://api.github.com/graphql")
  client.setHeader("Authorization", request.headers.authorization)
  try {
    // TODO: type this
    let { issues, hasNextPage, endCursor } = await fetchIssues(
      client,
      body.organization,
      body.project_id,
      body.start_date_field,
      body.end_date_field,
      body.use_milestones
    )

    while (hasNextPage) {
      let res = await fetchIssues(
        client,
        body.organization,
        body.project_id,
        body.start_date_field,
        body.end_date_field,
        body.use_milestones,
        endCursor
      )
      issues = issues.concat(res.issues)
      hasNextPage = res.hasNextPage
      endCursor = res.endCursor
    }

    response.status(200).json(issues)
  } catch (err) {
    console.error(err)
    response.status(500).send()
  }
}

async function fetchIssues(client, organization, projectId, startDateField, endDateField, useMilestones, startCursor) {
  let itemsQueryParams =  "first: 100"
  if (startCursor) {
    itemsQueryParams += `, after: "${startCursor}"`
  }

  const query = gql`
  {
    organization(login: "${organization}") {
      projectV2(number: ${projectId}) {
          id
          title
          items(${itemsQueryParams}) {
              pageInfo {
                  startCursor
                  hasNextPage
                  endCursor
              }
              nodes {
                  id
                  title: fieldValueByName(name :"Title") {
                      ... on ProjectV2ItemFieldTextValue {
                          text
                      }
                  }
                  start_date: fieldValueByName(name: "${startDateField}") {
                      ... on ProjectV2ItemFieldDateValue {
                          date
                      }
                  }
                  end_date: fieldValueByName(name: "${endDateField}") {
                      ... on ProjectV2ItemFieldDateValue {
                          date
                      }
                  }
                  milestone: fieldValueByName(name: "Milestone") {
                    ... on ProjectV2ItemFieldMilestoneValue {
                        milestone {
                            title
                        }
                    }
                  }
                  content {
                    ... on Issue {
                        id
                        number
                        url
                        bodyUrl
                    }
                    ... on PullRequest {
                        pr_id: id
                        pr_url: url
                        pr_isDraft: isDraft
                        pr_title: title
                    }
                  }
                }
            }
        }
    }
  }
  `

  const data = await client.request(query)
  let issues = []
  data.organization.projectV2.items.nodes.forEach((i) => {
    let issue = {
      id: i.id,
      title: i.title.text,
      category: data.organization.projectV2.title,
      start_date: null,
      end_date: null,
      url: null
    }
    if(i.start_date) {
      issue.start_date = i.start_date.date
    }
    if(i.end_date) {
      issue.end_date = i.end_date.date
    }
    if(i.content && i.content.url) {
      issue.url = i.content.url
    }
    if(useMilestones && i.milestone?.milestone?.title) {
      issue.category = i.milestone.milestone.title
    }
    issues.push(issue)
  })

  issues = issues.filter(i => i.start_date !== null)

  const { hasNextPage, endCursor } = data.organization.projectV2.items.pageInfo

  return {
    issues,
    hasNextPage,
    endCursor
  }
}