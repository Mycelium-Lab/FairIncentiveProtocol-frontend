import React, { Component } from "react";
import uploadIcon from "../media/common/upload_icon.svg"

class FileUpload extends Component {
    constructor(props) {
        super(props)
        this.input = React.createRef();
        this.state = {
            dragActive: false
        }
    }

    // handle drag events
    handleDrag (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            this.setState({
                setDragActive: true
            })
        } else if (e.type === "dragleave") {
            this.setState({
                setDragActive: false
            })
        }
    };

    // triggers when file is dropped
    handleDrop (e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            setDragActive: false
        })
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            this.handleFile(e.dataTransfer.files);
        }
    };

    // triggers when file is selected with click
    handleChange (e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            this.handleFile(e.target.files);
        }
    };

    // triggers the input when the button is clicked
    onButtonClick ()  {
        this.input.current.click();
    };

    handleFile(files) {
        this.props.getImage(files)
    }

    handleDrag = this.handleDrop.bind(this)
    handleDrop = this.handleDrop.bind(this)
    handleChange = this.handleChange.bind(this)
    onButtonClick = this.onButtonClick.bind(this)

    render() {
        return (
            <form id="form-file-upload" onDragEnter={this.handleDrag} onSubmit={(e) => e.preventDefault()}>
                <input ref={this.input} type="file" id="input-file-upload" multiple={true} onChange={this.handleChange} />
                <label id="label-file-upload" htmlFor="input-file-upload" className={this.dragActive ? "drag-active" : "" }>
                    <div className="form-file-upload__inner">
                    <img src={uploadIcon}></img>
                    <p className="form-file-upload__prompt">Recommended size: 350 x 350</p>
                    <button className="upload-button" onClick={this.onButtonClick}></button>
                    </div> 
                </label>
                { this.dragActive && <div id="drag-file-element" onDragEnter={this.handleDrag} onDragLeave={this.handleDrag} onDragOver={this.handleDrag} onDrop={this.handleDrop}></div> }
            </form>
        )
    }
}

export default FileUpload