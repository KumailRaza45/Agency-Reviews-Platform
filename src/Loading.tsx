import React from 'react';
import { BeatLoader } from 'react-spinners';
import { LoadingProps } from './Interface';

const Loading: React.FC = () => {
  return (
    <React.Fragment>
        <div className='bg-blend-overlay bg-loadingOverlay z-50 grid grid-cols-1 items-center justify-items-center fixed top-0 right-0 bottom-0 left-0'>
          <div>
            <BeatLoader color="#3364F7" cssOverride={{}} loading speedMultiplier={0.5}/>
          </div>
        </div>
    </React.Fragment>
  );
};

export default Loading;