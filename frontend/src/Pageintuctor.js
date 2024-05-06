
import LayoutPage from './LayoutPage';
import InstructorList from './List/instructor_list';

function Pageintructor({User}) {
 
  
  return (
    <LayoutPage>
      
      <InstructorList AUser = {User}/> 
      {/* <InstructorForm/> */}
      
    </LayoutPage>
  );
}

export default  Pageintructor;