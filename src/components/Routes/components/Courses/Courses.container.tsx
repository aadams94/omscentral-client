import React from 'react';
import Helmet from 'react-helmet';
import { useQuery } from '@apollo/react-hooks';
import { ICourse } from '../../../../data/interfaces';
import { GET_COURSES } from '../../../../data/queries';
import Courses from './Courses';

const CoursesContainer: React.FC = () => {
  const { data, loading } = useQuery<{ courses: ICourse[] }>(GET_COURSES);

  return (
    <>
      <Helmet title="Courses">
        <meta
          name="description"
          content="Course reviews for Georgia Tech's OMSCS, OMSA, &amp; OMSCyber programs."
        />
      </Helmet>
      <Courses courses={data?.courses} loading={loading} />
    </>
  );
};

export default CoursesContainer;
