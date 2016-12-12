/**
 * Created by Luke on 11-22-2014.
 */
angular.module('mapprojectApp').service('FireQuery', ($http) => {
  const defaultConfig = {
    date: 1950,
    srcagency: '',
  };
  this.getFires = (config, cb) => {
    const currentConfig = config || defaultConfig;
    this.domain = 'http://obsessively.ca';
    this.apiString = 'computermapping/fires';
    this.url = `${this.domain}/${this.apiString}`;
    this.fullUrl = this.url;

    /* Map configuration params to querystrings and values */
    Object.keys(defaultConfig).map((key) => {
      if (currentConfig[key] !== null){
        this.fullUrl += `?${key}=${currentConfig[key]}`;
      }
    });
    
    $http.get(this.fullUrl, { cache: true })
        .success((data, status, headers, config) => {
          cb(data);
        })
        .error((data, status, headers, config) => {
          console.log('Request failed');
        });
  };
  this.setAgency = function (a) {
    agency = a;
  };
  this.setDate = function (d) {
    date = d;
  };

  this.setFireType = function (t) {
    fireType = t;
  };
  this.getDate = function () {
    return date;
  };
  this.getFireType = function () {
    return fireType;
  };
  this.getAgency = function () {
    return agency;
  };
})
  .factory('FiresFact', ($http, FireQuery) =>
    // Return an api object
     ({
       get(params, cb) {
         const Fire = new FireQuery();
         Fire.setAgency(params.src);
         Fire.setDate(params.date);
        // Fire.setFireType(params.fireType);
        // debugger;
         Fire.getFires((data) => {
           cb(data);
         });
       },
     })).factory('StringsFact', () => {
       const strings = {
         provinces: [
        { name: 'Manitoba', key: 'MB' },
        { name: '', key: '' },
        { name: 'Ontario', key: 'ON' },
        { name: 'New Brunswick', key: 'NB' },
        { name: 'Alberta', key: 'AB' },
        { name: 'Northwest territories', key: 'NWT' },
        { name: 'Quebec', key: 'QC' },
        { name: 'Nova Scotia', key: 'NS' },
        { name: 'Newfoundland & Labrador', key: 'NL' },
        { name: 'Saskatchewan', key: 'SK' },
        { name: 'British Columbia', key: 'BC' },
        { name: 'Yukon', key: 'YT' },
        { name: 'PC-BA', key: 'PC-BA' },

        ],
       };
       return {

         getStrings() {
          return strings;
        },
       };
     });
