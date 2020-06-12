import React from 'react';

import { ReviewsQuery } from 'src/graphql';
import Button from '../Button';
import ReviewCardList from '../ReviewCardList';
import Toolbar, { SortKey } from './components/Toolbar';

export { SortKey };

interface Props {
  reviews?: ReviewsQuery['reviews'];
  sortKey: SortKey;
  onSortKeyChange: (key: SortKey) => void;
  onLoadMore?: () => void;
  loading?: boolean;
  before?: JSX.Element;
}

const ReviewCardListConnected: React.FC<Props> = ({
  reviews,
  sortKey,
  onSortKeyChange,
  onLoadMore,
  loading,
  before,
}) => (
  <ReviewCardList
    loading={loading}
    reviews={reviews}
    before={
      <>
        {before}
        <Toolbar sortKey={sortKey} onSortKeyChange={onSortKeyChange} />
      </>
    }
    after={
      onLoadMore && (
        <Button
          fullWidth
          onClick={onLoadMore}
          disabled={loading}
          color="default"
          variant="outlined"
          size="large"
        >
          Load More
        </Button>
      )
    }
  />
);

export default ReviewCardListConnected;
