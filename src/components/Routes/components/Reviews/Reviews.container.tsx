import React from 'react';
import { Helmet } from 'react-helmet';
import { GET_REVIEWS } from '../../../../data/queries';
import ReviewCardListConnected from '../../../ReviewCardListConnected';

const ReviewsContainer: React.FC = () => (
  <>
    <Helmet title="Reviews">
      <meta name="description" content="Reviews published recently." />
    </Helmet>
    <ReviewCardListConnected query={GET_REVIEWS} />
  </>
);

export default ReviewsContainer;
