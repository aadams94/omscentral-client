import React from 'react';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import Grow from '../../../Grow';
import Menu from '../../../Menu';
import { useStyles } from './Toolbar.styles';

export enum SortKey {
  Created = 'created',
  Semester = 'semester_id',
}

interface Props {
  sortKey: SortKey;
  onSortKeyChange: (key: SortKey) => void;
  onSearchStringEntered: (key: string) => void;
  message?: string;
}

const Toolbar: React.FC<Props> = ({ sortKey, onSortKeyChange, onSearchStringEntered, message }) => {
  const classes = useStyles();

  const items: [SortKey, string][] = [
    [SortKey.Semester, 'Semester'],
    [SortKey.Created, 'Created'],
  ];

  let searchString = ''; 

  return (
    <div className={classes.toolbar}>
      {message && <Typography variant="body2">{message}</Typography>}
      <Grow />
      <Typography variant="body2" className={classes.sortBy}>
        Sort by:
      </Typography>
      <Menu
        id="sort_by"
        icon={<ImportExportIcon fontSize="small" />}
        items={items.map(([key, label]) => ({
          key,
          onClick: () => onSortKeyChange(key),
          caption: (
            <Typography className={sortKey === key ? classes.bold : undefined}>
              {label}
            </Typography>
          ),
        }))}
      />
      <InputBase
              className={classes.input}
              placeholder="Search All Reviews ..." 
              onKeyPress={(e)=>{
                            if(e.key === 'Enter'){
                                onSearchStringEntered(searchString);
                            }
              }} 
              onChange={(e)=>{searchString = e.target.value;}}
              endAdornment={
                <InputAdornment position="end">
                      <IconButton
                        onClick={()=>{onSearchStringEntered(searchString)}}
                      >
                         <SearchIcon />
                      </IconButton> 
                </InputAdornment>
              }
      />
    </div>
  );
};

export default Toolbar;
