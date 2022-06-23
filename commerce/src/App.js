
import './App.css';
import  Home  from './component/Home';
import Navbar from './component/Navbar';
import {Switch,Route} from 'react-router-dom'
import Products from './component/Products';

function App() {
  return (
    <>
      <Navbar/>
      <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/products" component={Products}/>
      </Switch>
    </>
  );
}

export default App;
