import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import round from '../../../../../../utils/round';
import { ICourse } from '../../../../../../data/interfaces';
import { useStyles } from './Metrics.styles';

interface IProps {
  course: ICourse;
}

const Metrics: React.FC<IProps> = ({ course: { metric } }) => {
  const classes = useStyles();

  if (!metric) {
    return null;
  }

  const data: { label: string; value: number }[] = [
    {
      label: 'Reviews',
      value: metric.reviews.count
    },
    {
      label: 'Avg. Difficulty',
      value: metric.reviews.difficulty.mean
    },
    {
      label: 'Avg. Workload',
      value: metric.reviews.workload.mean
    },
    {
      label: 'Avg. Rating',
      value: metric.reviews.rating.mean
    }
  ];

  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <Grid container>
          {data.map(({ label, value }) => (
            <Grid item xs={12} md={3} key={label} className={classes.metric}>
              <Typography variant="body2" color="textSecondary">
                {label}
              </Typography>
              <Typography variant="subtitle2">{round(value, 2)}</Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Metrics;
