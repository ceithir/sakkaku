import React, { useState, useRef, useEffect } from "react";
import styles from "./Map.module.less";
import mapData from "./map-data";
import { AutoComplete, Input } from "antd";
import ScrollContainer from "react-indiana-drag-scroll";
import Animate from "rc-animate";
import { useLocation, useHistory } from "react-router-dom";
import ExternalLink from "../navigation/ExternalLink";

const {
  imgSrc,
  captions,
  grid: { columns: mapMaxX, rows: mapMaxY },
} = mapData;

const bound = ({ value, min, max }) => {
  return Math.max(min, Math.min(Math.round(value), max));
};

const fetchLocation = (name) => captions.find(({ label }) => label === name);

const HorizontalBar = ({ container, search }) => {
  const imageHeight = container.children[0].clientHeight;
  const containerHeight = container.clientHeight;

  const y = () => {
    const imageY = (search.y / mapMaxY) * imageHeight;
    const centerY = containerHeight / 2;
    if (imageY < centerY) {
      return imageY;
    }
    if (imageHeight - imageY < centerY) {
      return containerHeight - (imageHeight - imageY);
    }
    return centerY;
  };

  const top = bound({
    value: container.getBoundingClientRect().top + y(),
    min: 0,
    max: containerHeight,
  });

  return (
    <div
      className={styles["horizontal-bar"]}
      style={{
        top,
        left: container.getBoundingClientRect().left,
        width: container.clientWidth,
      }}
    />
  );
};

const VerticalBar = ({ container, search }) => {
  const imageWidth = container.children[0].clientWidth;
  const containerWidth = container.clientWidth;

  const x = () => {
    const imageX = (search.x / mapMaxX) * imageWidth;
    const centerX = containerWidth / 2;
    if (imageX < centerX) {
      return imageX;
    }
    if (imageWidth - imageX < centerX) {
      return containerWidth - (imageWidth - imageX);
    }
    return centerX;
  };

  const left = bound({
    value: container.getBoundingClientRect().left + x(),
    min: 0,
    max: containerWidth,
  });

  return (
    <div
      className={styles["vertical-bar"]}
      style={{
        left,
        top: container.getBoundingClientRect().top,
        height: container.clientHeight,
      }}
    />
  );
};

const PositionalCross = ({ scrollContainerRef, search, forceRefresh }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!scrollContainerRef.current || !search) {
      return;
    }
    setTimeout(() => {
      setShow(false);
    }, 1000 * 0.25);
    setShow(true);
  }, [scrollContainerRef, search, forceRefresh]);

  return (
    <Animate
      transitionName="fade"
      transitionAppear={false}
      transitionEnter={false}
      transitionLeave={true}
    >
      {show && (
        <>
          <HorizontalBar
            container={scrollContainerRef.current}
            search={search}
          />
          <VerticalBar container={scrollContainerRef.current} search={search} />
        </>
      )}
    </Animate>
  );
};

const Search = ({ scrollContainerRef, imageLoaded }) => {
  const [search, setSearch] = useState();
  const location = useLocation();
  let history = useHistory();
  const [autocompleteValue, setAutocompleteValue] = useState();
  const [forceRefresh, setForceRefresh] = useState();

  useEffect(() => {
    if (!search || !scrollContainerRef.current || !imageLoaded) {
      return;
    }

    const container = scrollContainerRef.current;

    const imageWidth = container.children[0].clientWidth;
    const imageHeight = container.children[0].clientHeight;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const scrollConfig = {
      left: bound({
        value: (search.x / mapMaxX) * imageWidth - containerWidth / 2,
        min: 0,
        max: imageWidth,
      }),
      top: bound({
        value: (search.y / mapMaxY) * imageHeight - containerHeight / 2,
        min: 0,
        max: imageHeight,
      }),
      behavior: "smooth",
    };
    container.scrollTo(scrollConfig);
  }, [search, scrollContainerRef, imageLoaded, forceRefresh]);

  useEffect(() => {
    if (!imageLoaded) {
      return;
    }

    if (!location.hash) {
      return;
    }

    if (search) {
      return;
    }

    const hash = decodeURI(location.hash.slice(1));
    const loc = fetchLocation(hash);
    if (loc) {
      setSearch(loc);
      setAutocompleteValue(loc.label);
    }
  }, [location, setSearch, imageLoaded, search]);

  const onSearch = (value) => {
    const loc = fetchLocation(value);

    if (!loc) {
      // TODO: Some kind of message that the search did not end up on anything
      setSearch(null);
      history.push({ hash: null });
      return;
    }

    if (loc.label === search?.label) {
      setForceRefresh(Date.now());
      return;
    }

    setSearch(loc);
    history.push({ hash: loc.label });
  };

  return (
    <>
      <div className={styles.search}>
        <AutoComplete
          options={captions.map(({ label }) => {
            return { value: label };
          })}
          onSelect={onSearch}
          filterOption={true}
          value={autocompleteValue}
          onChange={setAutocompleteValue}
        >
          <Input.Search
            placeholder={`Search location`}
            allowClear={true}
            onSearch={onSearch}
          />
        </AutoComplete>
      </div>
      <PositionalCross
        scrollContainerRef={scrollContainerRef}
        search={search}
        forceRefresh={forceRefresh}
      />
    </>
  );
};

const Map = () => {
  const scrollContainerRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        <p>
          {`A simple reupload of `}
          <ExternalLink href="https://craneclan.weebly.com/map-of-rokugan.html">{`Trevor "Kakita Onimaru" Cuba's work`}</ExternalLink>
          {` at a more web-friendly resolution. Follow link for full credits and information.`}
        </p>
        <Search
          scrollContainerRef={scrollContainerRef}
          imageLoaded={imageLoaded}
        />
      </div>
      <ScrollContainer
        className={styles["scroll-container"]}
        hideScrollbars={false}
        innerRef={scrollContainerRef}
      >
        <img
          src={imgSrc}
          alt="Rokugan map (5th ed)"
          onLoad={() => {
            setImageLoaded(true);
          }}
        />
      </ScrollContainer>
    </div>
  );
};

export default Map;
