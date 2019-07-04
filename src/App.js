import React, { Component } from "react";
import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import { saveAs } from "file-saver";
import "./App.css";
import axios from 'axios';
import { ProgressBar } from 'react-bootstrap';


class App extends Component {
  constructor(props) {
    super(props);
    this.handleCheckBox = this.handleCheckBox.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleShowURLForm = this.handleShowURLForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      url : '',
      selectedURLS: null,
      downloadLoding: false,
      showURLForm : false,
      downloadPercent: 0,
      showprogress : false,
      downloadingMessage:null,
      addURLS: [
        {
            "url": "https://uat.freescale.com/docs/en/application-note/AN4255.pdf" //630kb
        },
        {
            "url": "https://uat.freescale.com/docs/en/application-note/AN4265.pdf" //2 mb
        },
        {
            "url": "https://uat.freescale.com/docs/en/reference-manual/MPC5775KRM.pdf " //22 mb
        },
        {
            "url": "https://uat.freescale.com/docs/en/reference-manual/MPC5777MRM.pdf "  //27.8 mb
        },
        // {
        //   "url":"https://pixabay.com/get/50e7d2444d56b108f5d08460962935791436d9e2554c704c732d7ad29748cc5d_1280.jpg"
        // },
        // {
        //   "url":"https://pixabay.com/get/57e2d1464d55aa14f6da8c7dda79367c123ed7e254576c48702979d5914dc051bd_1280.jpg"
        // },
        // {
        //   "url":"https://pixabay.com/get/57e8d5444f51af14f6da8c7dda79367c123ed7e254576c48702979d5914dc051bd_1280.jpg"
        // },
        // {
        //   "url":"https://pixabay.com/get/55e3d3454d50b108f5d08460962935791436d9e2554c704c732d7ad29748cc5d_1280.jpg"
        // },
        // {
        //   "url":"https://cache.nxp.com/secured/assets/downloads/en/secured/distynet/training/processors-microcontrollers/iMX-8M-Mini-Hands-On-Lab-Guide.pdf?__gda__=1562171535_f8a86341d2aab2f28407e7ce5cd49cd8&fileExt=.pdf"
        // }
      ]
    };
  }
  handleShowURLForm(e){
    e.preventDefault();    
    this.setState({ showURLForm: true });    
  }
  handleChange(e) {
    this.setState({url: e.target.value});
  }
  handleSubmit(e) {
    e.preventDefault();
    let newAddURLS = this.state.addURLS;
    newAddURLS.push({
      "url":this.state.url
    })
    this.setState({addURLS:newAddURLS});

  }
  addImg(arr, item){ return arr.find(x => x.url === item.url) || arr.push(item)};
  handleCheckBox(e, links) {
    let arr = this.state.selectedURLS ? this.state.selectedURLS : [];
    if (e.target.checked) {
      // console.log('checked')
      this.addImg(arr, {
        url: links.url
      });
      this.setState({ selectedURLS: arr });
      // console.log('arr=>',arr);
    } else {
      // console.log('not checked');
      let item = { url: links.url };
      arr = arr.filter(x => x.url !== item.url);
      this.setState({ selectedURLS: arr });
      // console.log('arr=>',arr);
    }
  }
  handleDownload(e) {
    e.preventDefault();
    let zip = new JSZip();
    let zipFilename = "distynet.zip";
    let selectedURLS = this.state.selectedURLS;
    this.setState({ downloadLoding: true });
    this.setState({ showprogress: true });
    this.setState({ downloadingMessage: "Download Inprogress" });
    const urlToPromise = url => {
      return new Promise((resolve, reject) => {
        JSZipUtils.getBinaryContent(url, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
        // return axios({
        //   method: 'GET',
        //   url: url, //SOLR TESTING
        //   timeout: 20000,
        //   responseType:"blob",
        // })
        //   .then(function (response) {
        //       console.log("resolve =>", response.data);
        //       resolve(response.data); 
        //   })
        //   .catch(function (response) {
        //       console.log("reject =>", response.data);
        //       reject(response.data);
        //   });
      });
    };
    selectedURLS.forEach(links => {
      let url = links.url;
      let filename = url.replace(/.*\//g, "");
      let fNames  = filename.split("?");
      let fName = fNames[0];
      console.log("filename=>",fName);      
      zip.file(fName, urlToPromise(url), { binary: true });
      // zip.file(fName, url, { binary: true });
    });
    console.log("zip=>",zip);
    // zip.generateAsync({ type: "blob",mimeType: "application/x-octet-stream" }, (metadata) => {
      zip.generateAsync({ type: "blob"}, (metadata) => {
      console.log("metadata =>", metadata);
      this.setState({ downloadPercent: metadata.percent });
      this.setState({ showprogress: true });
      this.setState({ downloadingMessage: `Download inprogress, percentage: ${metadata.percent}%` });
  })
    .then(blob => {
        saveAs(blob, zipFilename);
        this.setState({ downloadLoding: false });
        this.setState({ showprogress: false });
        
      },
      err => {}
    );
  }

  render() {
    return (
      <div className="App">
        {/* <header>
          <h1 id="heading">Multiple Download POC</h1>
          <p>
            POC for fetch downloadable <b>cache-url</b> from simple API call and
            creating <b>.zip</b> files with lovely JavaScript, and then download
            zip file in <b>browser</b>.
          </p>
        </header> */}
        <div id="backHome">
          <a href="/pages/multiple-download-poc:MULTIPLE_DOWNLOAD_POC" className="button info">
              Refresh
            </a>  
          <a href="/" className="button info" onClick={e => this.handleShowURLForm(e)}>
            Add URL
          </a>          
            {!this.state.downloadLoding ? (
              <a
                href="/"
                className="button success"
                onClick={e => this.handleDownload(e)}
              >
                Download
              </a>
            ) : (
              <a className="button ">Download Started!</a>
            )}
          
        </div>
        <div className="containerss">
          {this.state.showprogress ?
                (
                    <ProgressBar
                        animated={true}
                        now={this.state.downloadPercent}
                        label={`${this.state.downloadPercent}%`}
                    />
                ) : null }
        {this.state.showURLForm ? (
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-90">
                <input
                  type="url"
                  placeholder="https://example.com"
                  defaultValue={this.state.url}
                  onChange={this.handleChange}
                  // pattern="https://.*"
                  required
                />
              </div>
              <div className="col-10">
                <input type="submit" value="Add URL" />
              </div>
            </div>
          </form>
          ):null}
          <table border="1" id="tableContainer">
            <thead>
              <tr>
                <th>File Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="container">
              {this.state.addURLS ? (
                this.state.addURLS.map((links, index) => (
                  <tr key={index}>
                    <td>
                      <a href={links.url} className="tablelinks">{links.url}</a>
                    </td>
                    <td align="center">
                      <input
                        type="checkbox"
                        onChange={e => this.handleCheckBox(e, links)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" align="center">
                    {" "}
                    No URL Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
