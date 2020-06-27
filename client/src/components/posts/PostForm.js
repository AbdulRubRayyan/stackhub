import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { addPost } from "../../actions/postAction";
import TextFieldGroup from "../common/TextFieldGroup";
import Editor from "react-simple-code-editor";

import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markup";
require("prismjs/components/prism-jsx");

class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      text: "",
      code: "",
      errors: {},
      displayCodeInput: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const { user } = this.props.auth;

    const newPost = {
      title: this.state.title,
      text: this.state.text,
      code: this.state.code,
      name: user.name,
      avatar: user.avatar
    };

    this.props.addPost(newPost);
    this.setState({ text: "", code: "", title: "", errors: {} });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors, displayCodeInput } = this.state;
    let CodeInput;

    if (displayCodeInput) {
      CodeInput = (
        <div>
          <Editor
            // className="form-control form-control-lg mt-2"
            placeholder="Add your code"
            name="code"
            highlight={code => highlight(code, languages.jsx)}
            value={this.state.code}
            onValueChange={code => this.setState({ code })}
            errors={errors.code}
            padding={10}
            style={{
              height: "200px",
              whiteSpace: "pre-line",
              border: "0.5px solid #d5dfed"
            }}
          ></Editor>
        </div>
      );
    }

    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-dark text-white">Create a post</div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <TextFieldGroup
                  placeholder="Add a title"
                  name="title"
                  value={this.state.value}
                  onChange={this.onChange}
                  errors={errors.title}
                />
                <TextAreaFieldGroup
                  placeholder="Create a post"
                  name="text"
                  value={this.state.text}
                  onChange={this.onChange}
                  error={errors.text}
                  rows="5"
                />
                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      this.setState(prevState => ({
                        displayCodeInput: !prevState.displayCodeInput
                      }));
                    }}
                    className="btn btn-light"
                  >
                    Add Code
                  </button>
                </div>
                {CodeInput}
              </div>
              <button type="submit" className="btn btn-dark">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { addPost })(PostForm);
