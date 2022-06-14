import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "../../../styles/Settings/Background/YouTubeSearch/YouTubeSearch.module.css";
import axios from "axios";
import { BackgroundContext } from "../../BackgroundContext";
import Spinner from 'react-bootstrap/Spinner'

interface Video {
    videoId: String
    thumbnail: String,
    title: String,
    channelTitle: String
}

const Videos: Video[] = [];
let timeout;

const YouTubeSearch = () => {
    const [terms, setTerms] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const isInitialMount = useRef<boolean>(true);
    const [page, setPage] = useState(0);
    const [nextPageToken, setNextPageToken] = useState<string>('');
    const settings: any = document.getElementById('settings-body');
    const { changeBackground, isOnlyMusic, setIsOnlyMusic, eventType, setEventType, setYoutubeResults, youtubeResults } = useContext(BackgroundContext);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        let search = localStorage.getItem("youtubesearch");
        search ? setTerms(search) : setTerms("");

        if (settings) {
            settings.scrollTo({ top: 650, behavior: 'smooth' });
        }

        const checkbox = document.getElementById('musicCheckbox') as HTMLInputElement;
        isOnlyMusic ? checkbox.checked = true : checkbox.checked = false;

        const checkbox2 = document.getElementById('liveCheckbox') as HTMLInputElement;
        eventType === 'live' ? checkbox2.checked = true : checkbox2.checked = false;

    }, []);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        }
        localStorage.setItem("youtubesearch", terms);
    }, [terms]);

    const reset = () => {
        setNextPageToken('');
        setYoutubeResults([]);
    }

    const submitForm = (event: React.ChangeEvent<HTMLInputElement>): void => {
        event.preventDefault();
        setIsLoading(true);
        timeout = setTimeout(() => {
            setIsLoading(false);
            setIsError(true);
        }, 10000)
        fetchVideos(terms, eventType);
    }

    const changeTerms = (event: React.ChangeEvent<HTMLInputElement>): void => {
        event.preventDefault();
        setTerms(event.target.value);
    };

    const fetchVideos = (searchTerms: string, eventType: string) => {
        if (isOnlyMusic && !searchTerms.includes("youtube.com")) {
            if (!searchTerms.includes("music")) {
                searchTerms = searchTerms + " music";
            }
        }

        if (searchTerms.includes("youtube.com")) {
            eventType = "completed";
        }

        axios
            .get(`/api/videos?terms=${searchTerms}&eventType=${eventType}`)
            .then((data) => {
                setIsError(false);
                setNextPageToken(data.data.nextPageToken);
                processData(data.data.items, false);
                if (settings) {
                    settings.scrollTo({ top: 650, behavior: 'smooth' });
                }
            })
            .catch((err) => {
                console.log('Err', err);
                setIsError(true);
            })
    };

    const fetchMoreVideos = (searchTerms: string, eventType: string, pageToken: string) => {
        if (isOnlyMusic && !searchTerms.includes("youtube.com")) {
            if (!searchTerms.includes("music")) {
                searchTerms = searchTerms + " music";
            }
        }

        if (searchTerms.includes("youtube.com")) {
            eventType = "completed";
        }

        axios
            .get(`/api/videos?terms=${searchTerms}&eventType=${eventType}&pageToken=${pageToken}`)
            .then((data) => {
                setIsError(false);
                setNextPageToken(data.data.nextPageToken);
                processData(data.data.items, true);
                // if (settings) {
                //     settings.scrollTo({ top: 520, behavior: 'smooth' });
                // }
            })
            .catch((err) => {
                console.log('Err', err);
                setIsError(true);
            })
    }

    const processData = (data: any, append: boolean) => {
        let processed: any = [];
        data.forEach(video => {
            processed.push({
                live: video.snippet.liveBroadcastContent,
                videoId: video.id.videoId,
                thumbnail: video.snippet.thumbnails.high.url,
                title: video.snippet.title.replace(' &amp;', ''),
                channelTitle: video.snippet.channelTitle
            });
        })
        if (append) {
            let temp: any = youtubeResults.slice(0);
            temp = [...temp, ...processed];
            setYoutubeResults(temp);
            setIsLoadingMore(false);
        } else {
            setYoutubeResults(processed);
        }
    }

    useEffect(() => {
        if (youtubeResults.length) {
            setIsLoading(false);
            clearTimeout(timeout);
            setPage(youtubeResults.length / 10 - 1);
        }
    }, [youtubeResults])

    const selectVideo = (id: string) => {
        changeBackground(id);
        // save to recently selected
    }

    const chooseSuggestion = (e, term) => {
        e.preventDefault();
        setTerms(term);
    }

    const radioChangeHandler = (e: any) => {
        e.target.checked ? setIsOnlyMusic(true) : setIsOnlyMusic(false);
        reset();
    };

    const checboxChangeHandler = (e: any) => {
        e.target.checked ? setEventType('live') : setEventType('completed');
        reset();
    };

    const loadMore = (e: any) => {
        e.preventDefault();
        if (page < 5) {
            fetchMoreVideos(terms, eventType, nextPageToken);
            setIsLoadingMore(true);
        }
    }

    const scrollToTop = (e: any) => {
        e.preventDefault();
        if (settings) {
            settings.scrollTo({ top: 650, behavior: 'smooth' });
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.searchTitle}>Search YouTube</div>
            <div className={styles.formsWrapper}>
                <form className={styles.checkboxWrapper} onChange={(e: any) => radioChangeHandler(e)}>
                    <input className={styles.checkbox} type="checkbox" id="musicCheckbox" name="filter" value="Music Only" defaultChecked />
                    <label className={styles.checkboxLabel} htmlFor="musicCheckbox">Music Only</label>
                </form>
                <form className={styles.checkboxWrapper} onChange={(e: any) => checboxChangeHandler(e)}>
                    <input className={styles.checkbox} type="checkbox" id="liveCheckbox" name="live" value="Live" defaultChecked />
                    <label className={styles.checkboxLabel} htmlFor="liveCheckbox">Live Stream</label>
                </form>
            </div>
            <div className={styles.suggestionWrapper}>
                <span className={styles.text}>Suggestions:</span>
                <button className={styles.suggestionBtn} onClick={(e: any) => chooseSuggestion(e, 'Lo-Fi')}>Lo-Fi</button>
                <button className={styles.suggestionBtn} onClick={(e: any) => chooseSuggestion(e, 'Jazz')}>Jazz</button>
                <button className={styles.suggestionBtn} onClick={(e: any) => chooseSuggestion(e, 'Soft Pop')}>Soft Pop</button>
                <button className={styles.suggestionBtn} onClick={(e: any) => chooseSuggestion(e, 'Anime')}>Anime</button>
                <button className={styles.suggestionBtn} onClick={(e: any) => chooseSuggestion(e, 'Video Game')}>Video Game</button>
            </div>
            <form className={styles.form} onSubmit={(e: any) => submitForm(e)}>
                <input
                    type="text"
                    value={terms}
                    className={styles.searchInput}
                    placeholder="Enter search query or YouTube link"
                    onChange={(event: any) => {
                        changeTerms(event);
                    }}
                />
                <input
                    className={styles.searchBtn}
                    type="button"
                    value="Search"
                    onClick={(e: any) => submitForm(e)}
                />
            </form>
            <div className={styles.searchResults}>
                {isError && <span>Server cannot be reached. Please try again later.</span>}
                {isLoading &&
                    <div className={styles.loadingContainer}>
                        <Spinner animation="border" variant="primary" />
                    </div>
                }
                {youtubeResults.map((video: any) => {
                    return (
                        <div className={styles.videoResult} key={video.videoId + page} onClick={() => selectVideo(video.videoId)}>
                            <div className={styles.imgWrapper}>
                                {video.live === 'live' && <span className={styles.liveIndicator}>◉ LIVE</span>}
                                <img className={styles.thumbnail} src={video.thumbnail} />
                            </div>
                            <div className={styles.textWrapper}>
                                <span className={styles.title}>{video.title}</span>
                                <span className={styles.channel}>{video.channelTitle}</span>
                            </div>
                        </div>
                    )
                })}
                {youtubeResults.length ?
                    <div className={styles.btnDiv}>
                        {isLoadingMore &&
                            <div className={styles.loadingContainer}>
                                <Spinner animation="border" variant="primary" />
                            </div>
                        }
                        <button className={styles.loadBtn} onClick={(e: any) => scrollToTop(e)}>Scroll To Top</button>
                        {page < 5 ? <button className={styles.loadBtn} onClick={(e: any) => loadMore(e)}>Load More</button> : null}
                    </div>
                    : null
                }
            </div>
        </div>
    );
};

export default YouTubeSearch;