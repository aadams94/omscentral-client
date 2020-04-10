import gql from 'graphql-tag';

export const GET_COURSES = gql`
  query getCourses {
    courses(orderBy: id) {
      id
      department
      number
      name
      foundational
      deprecated
      metric {
        reviews {
          count
          difficulty {
            mean
            median
            mode
            min
            max
          }
          workload {
            mean
            median
            mode
            min
            max
          }
          rating {
            mean
            median
            mode
            min
            max
          }
        }
      }
    }
  }
`;