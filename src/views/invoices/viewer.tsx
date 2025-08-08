import { PDFViewer } from '@react-pdf/renderer';
import MyDocument from './test';

const Viewer = () => (
  <div className='w-full h-[750px]'>

  <PDFViewer width={'100%'} height={'100%'}>
    <MyDocument />
  </PDFViewer>
  </div>
);

export default Viewer;