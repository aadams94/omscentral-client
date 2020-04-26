import React, { useContext, useMemo } from 'react';
import { useHistory } from 'react-router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { FirebaseContext } from '../Firebase';
import { NotificationContext } from '../Notification';
import { ICourse, ISemester, IReview } from '../../data/interfaces';
import {
  GET_COURSES,
  GET_SEMESTERS,
  INSERT_REVIEW as INSERT,
  UPDATE_REVIEW as UPDATE,
  DELETE_REVIEW as DELETE,
} from '../../data/queries';
import { AuthContext } from '../Auth';
import ReviewForm, { FormData } from './ReviewForm';

interface IProps {
  review?: IReview;
}

const ReviewFormContainer: React.FC<IProps> = ({ review }) => {
  const firebase = useContext(FirebaseContext);
  const notification = useContext(NotificationContext)!;
  const history = useHistory();
  const auth = useContext(AuthContext);
  const mode = useMemo(
    () =>
      !review ? 'make' : auth.user?.uid === review.author_id ? 'edit' : 'view',
    [auth, review]
  );

  const [courses, semesters] = [
    useQuery<{ courses: ICourse[] }>(GET_COURSES),
    useQuery<{ semesters: ISemester[] }>(GET_SEMESTERS),
  ];

  const [
    [insert, { loading: creating }],
    [update, { loading: updating }],
    [remove, { loading: removing }],
  ] = [
    useMutation<{ insertReview: IReview }, { review: Partial<IReview> }>(
      INSERT
    ),
    useMutation<{ updateReview: IReview }, { review: Partial<IReview> }>(
      UPDATE
    ),
    useMutation<{ deleteReview: IReview }, { id: string }>(DELETE),
  ];

  const handleSubmit = async (form: FormData) => {
    try {
      const author_id = auth.user!.uid;
      if (mode === 'make') {
        const result = await insert({
          variables: {
            review: {
              ...form,
              author_id,
            },
          },
        });

        firebase.analytics.logEvent('create_item', {
          content_type: 'review',
          content_id: result.data!.insertReview.id,
        });

        notification.success('Review published.');

        history.push(`/course/${form.course_id}`);
      } else if (mode === 'edit') {
        await update({ variables: { review: { ...form, author_id } } });

        firebase.analytics.logEvent('update_item', {
          content_type: 'review',
          content_id: review!.id,
        });

        notification.success('Review updated.');

        history.push(`/course/${form.course_id}`);
      }
    } catch {
      notification.error('Something went wrong.');
    }
  };

  const handleDelete = async () => {
    try {
      await remove({ variables: { id: review!.id } });

      firebase.analytics.logEvent('delete_item', {
        content_type: 'review',
        content_id: review!.id,
      });

      notification.success('Review deleted.');

      history.replace(`/course/${review!.course_id}`);
    } catch {
      notification.error('Something went wrong.');
    }
  };

  if (!courses.data?.courses || !semesters.data?.semesters) {
    return null;
  }

  return (
    <ReviewForm
      data={{ ...courses.data, ...semesters.data }}
      mode={mode}
      review={review}
      disabled={creating || updating || removing}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
    />
  );
};

export default ReviewFormContainer;
