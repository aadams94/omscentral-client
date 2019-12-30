import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { IReview } from '../../data/interfaces';
import useSession from '../../utils/useSessionStorage';
import ReviewCardListConnected, { SortKey } from './ReviewCardListConnected';

interface IProps {
  query: any;
  variables?: any;
  pagination?: boolean;
  before?: JSX.Element;
}

const ReviewCardListConnectedContainer: React.FC<IProps> = ({
  query,
  variables = {},
  pagination = true,
  before
}) => {
  const [paginate, setPaginate] = useState(pagination);
  const [limit, setLimit] = useSession<number>('rcl:l', paginate ? 10 : 10e6);
  const [sortKey, setSortKey] = useSession<SortKey>('rcl:sk', SortKey.Semester);
  const { data, loading, fetchMore } = useQuery<{ reviews: IReview[] }>(query, {
    variables: {
      ...variables,
      limit,
      orderByDesc: sortKey,
      orderByDescToo: SortKey.Created
    },
    fetchPolicy: 'cache-and-network'
  });

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        offset: data!.reviews!.length
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (fetchMoreResult?.reviews?.length) {
          setPaginate(fetchMoreResult.reviews.length >= limit);
          return {
            ...prev,
            reviews: prev.reviews.concat(fetchMoreResult.reviews)
          };
        }
        setPaginate(false);
        return prev;
      }
    });
  };

  const handleSortKeyChange = (key: SortKey) => {
    if (key !== sortKey) {
      setLimit(10);
      setSortKey(key);
    }
  };

  return (
    <ReviewCardListConnected
      loading={loading}
      reviews={data?.reviews}
      sortKey={sortKey}
      onSortKeyChange={handleSortKeyChange}
      onLoadMore={
        paginate && data?.reviews?.length && data.reviews.length >= limit
          ? handleLoadMore
          : undefined
      }
      before={before}
    />
  );
};

export default ReviewCardListConnectedContainer;
