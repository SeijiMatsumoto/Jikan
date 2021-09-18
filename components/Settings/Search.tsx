import React, { useState, useEffect, useRef, useContext } from 'react';
import type { NextPage } from 'next';
import axios from 'axios';
import styles from '../../styles/Search/Search.module.css';
import PhotoTile from './PhotoTile';
import Page from './Page';

interface Photo {
  url: string,
  avg_color: string,
  src: {
    original: string,
    medium: string
  }
}


const photos: Photo[] = [];

const Search: NextPage = () => {
  const [terms, setTerms] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [images, setImages] = useState<typeof photos>([])
  const [maxPages, setMaxPages] = useState<number>(0)
  const isInitialMount = useRef<boolean>(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      fetchImages(terms, page);
    }
  },[terms, page]);


  const changeTerms = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    setTerms(event.target.value);
    setPage(1);
  };

  const fetchImages = (searchTerms: string, pageNumber: number): void => {
    axios.get(`/api/images?terms=${searchTerms}&page=${pageNumber}`)
      .then((data) => {
        setImages(data.data.photos);
        setMaxPages(Math.ceil(data.data.total_results/12));
      })
      .catch((error) => {console.log(error);})
  };

  const changePage = (direction: boolean): void => {
    let newPage = page;
    direction ? newPage++: newPage--;
    setPage(newPage);
  };

  return (
    <div className={styles.search}>
      <form>
        <input type='text' onChange={(event: any)=>{changeTerms(event)}}/>
      </form>
      <div className={styles.images}>
      {images.map((image) => {
        return (
          <PhotoTile key={image.url} url={image.url} avg_color={image.avg_color} src={image.src} />
        )})}
      </div>
      <Page changePage={changePage} page={page} maxPages={maxPages}/>
    </div>
  );
};

export default Search;