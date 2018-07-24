import React, { Component } from 'react';
import * as axios from 'axios';
import SearchForm from './components/searchForm';
import Results from './components/results';
import LoadingScreen from  './components/loadingScreen';
import ErrorMessage from './components/errorMessage';
import * as _ from 'lodash';

class App extends Component {
  constructor(){
    super();

    this.itemsPerPage = 10;
    this.baseUrl = process.env.NODE_ENV === 'development' ? 'http://move.mil.localhost:8000/' : '/';
    this.state = {
      isLoading: false,
      geolocation: {
        disabled: false,
        coords: null
      },
      searchLocation: '',
      results: null,
      errorMessage: null
    };
  }


  getGeolocation = (nextFn) =>{
    let response = {
      disabled: false,
      coords: null
    };

    if("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition((position) => {
        response.disabled = false;
        response.coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        nextFn(null, response);
      }, (err)=>{
        nextFn(err.message);
      });
    }else{
      nextFn("Navigator doesn't support geolocation");
    }
  }

  setSearchLocation = (val) =>{
    this.setState({
      searchLocation: val
    });
  }

  onInitialSearchLocation = (isLocationServices) =>{
    if(!isLocationServices && !this.state.searchLocation) return;

    this.setState({isLoading: true});
    if(isLocationServices){
      this.getGeolocation((navigatorErr, navigatorRes)=>{
        if(navigatorErr){
          this.handleError(navigatorErr);
        }else{
          this.requestData(navigatorRes.coords);
        }
      });
    }else{
      this.requestData({ query: this.state.searchLocation });
    }   
  }

  setValidationFlag = (val) =>{
    this.setState({
      validationError: val
    });
  }

  handleError = (errMessage) => {
    this.setState({
      isLoading: false,
      errorMessage: errMessage,
      geolocation: {...this.state.geolocation, disabled: true}
    });
  }

  requestData = (options) =>{
      let url = `${this.baseUrl}parser/locator-maps`;
      let coords = options.query ? options : {};

      axios.post(url, options)
        .then(res => {
          let results = res.data;

          if(!results.offices){
            this.handleError("no results.");
            return;
          }

          coords = {
            latitude: results.geolocation.lat,
            longitude: results.geolocation.lon
          }
          results.selectedPage = 1;
          results.offices = _.sortBy(results.offices, 'distance_mi');

          _.each(results.offices, (office, i)=>{
              office.id = `office-${i}`;
          });

          this.setState({
            geolocation: {...this.state.geolocation, coords: coords},
            results: results,
            isLoading: false
          });
        }).catch(error => {
          this.handleError(error);
        });;
  }

  changePageNo = (pageNo, totalPages) => {
    pageNo = pageNo === '1' ? this.state.results.selectedPage + 1 : pageNo;
    pageNo = pageNo === '-1' ? this.state.results.selectedPage - 1 : pageNo;

    if(pageNo < 1 || pageNo > totalPages || pageNo === this.state.results.selectedPage) return;

    this.setState({
      results: {...this.state.results, selectedPage: pageNo}
    });
  }

  displayResultComponent = () =>{
    if(this.state.results){
      return (
        <Results resultData={this.state.results}
                 itemsPerPage={this.itemsPerPage}
                 changePageFn={this.changePageNo}/>
      )
    }
  }

  render() {
    return (
      <div className="locator-map-container">
        <LoadingScreen isLoading={this.state.isLoading}/>
        <SearchForm setSearchLocationFn={this.setSearchLocation} 
                    searchFn={this.onInitialSearchLocation} 
                    searchLocation={this.state.searchLocation}
                    geoLocationDisabled={this.state.geolocation.disabled}
                    isInvalidFields={this.state.validationError}
                    setValidationFlagFn={this.setValidationFlag}/>

        <ErrorMessage error={this.state.errorMessage}/>
                    
        {this.displayResultComponent()}
      </div>
    );
  }
}

export default App;
