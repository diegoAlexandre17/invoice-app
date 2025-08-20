import InvoicePDF from '@/components/Invoice/InvoicePDF';
import { PDFViewer } from '@react-pdf/renderer';

const Viewer = () => (
  <div className='w-full h-[750px]'>

  <PDFViewer width={'100%'} height={'100%'}>
    {/* <MyDocument /> */}
    <InvoicePDF />
  </PDFViewer>
  </div>
);

export default Viewer;