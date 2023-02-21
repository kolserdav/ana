import clsx from 'clsx';
import NextImage, { ImageLoader } from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { IMAGE_EXT, IMAGE_PREV_POSTFIX, PREVIEW_IMAGE_WIDTH } from '../../types/interfaces';
import { setBodyScroll } from '../../utils/lib';
import CloseIcon from '../icons/Close';
import IconButton from './IconButton';
import s from './Image.module.scss';

const getSrcPreview = (src: string) =>
  src.replace(new RegExp(`${IMAGE_EXT}$`), `${IMAGE_PREV_POSTFIX}${IMAGE_EXT}`);

const imageLoader: ImageLoader = ({ src: _src, width }) => {
  let src = _src;
  if (width <= PREVIEW_IMAGE_WIDTH) {
    src = getSrcPreview(_src);
  }
  return src;
};

function Image({
  width: _width,
  height: _height,
  alt,
  src,
  preHeight,
  preWidth,
}: {
  width: number;
  height: number;
  preWidth: number;
  preHeight: number;
  alt: string;
  src: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState<number>(preWidth);
  const [height, setHeight] = useState<number>(preHeight);
  const [zoomIn, setZoomIn] = useState<boolean>(false);
  const [full, setFull] = useState<boolean>(false);

  const imageOnClick = () => {
    if (!full) {
      setFull(true);
    } else {
      setZoomIn(!zoomIn);
    }
  };

  const onCloseImageClick = () => {
    setFull(false);
    setZoomIn(false);
  };

  const onKeyImageDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = e;
    if (key === 'Enter') {
      imageOnClick();
    }
  };

  /**
   * Set body scroll
   */
  useEffect(() => {
    setBodyScroll(!full);
  }, [full]);

  /**
   * Set width
   */
  useEffect(() => {
    if (full) {
      setWidth(_width);
      setHeight(_height);
    } else {
      setWidth(preWidth);
      setHeight(preHeight);
    }
  }, [full, _width, _height, preHeight, preWidth]);

  console.log(zoomIn);
  // FIXME zoom in with small images

  return (
    <div
      ref={wrapperRef}
      role="button"
      tabIndex={-1}
      onKeyDown={onKeyImageDown}
      className={clsx(s.wrapper, full ? s.full : '', zoomIn ? s.zoom__out : '')}
      onClick={imageOnClick}
    >
      {/** strong first child */}
      <NextImage
        blurDataURL={getSrcPreview(src)}
        loader={imageLoader}
        fill={full && !zoomIn}
        width={full && !zoomIn ? undefined : width}
        height={full && !zoomIn ? undefined : height}
        style={{ objectFit: zoomIn ? undefined : 'contain' }}
        src={src}
        alt={alt}
      />
      <IconButton className={s.close} onClick={onCloseImageClick}>
        <CloseIcon color="white" />
      </IconButton>
    </div>
  );
}

export default Image;
