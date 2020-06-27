import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { addComment } from "../../actions/postAction";

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const { postId } = this.props;

    const newComment = {
      text: this.state.text,
      code: this.state.code,
      name: user.name,
      avatar: user.avatar
    };

    this.props.addComment(postId, newComment);
    this.setState({ text: "", code: "", errors: {} });
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
          <textarea
            className="form-control form-control-lg mt-2"
            placeholder="Add your code"
            name="code"
            value={this.state.code}
            onChange={this.onChange}
            errors={errors.code}
            rows="7"
            wrap="hard"
          ></textarea>
        </div>
      );
    }

    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-dark text-white">
            Make a comment...
          </div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Reply to post"
                  name="text"
                  value={this.state.text}
                  onChange={this.onChange}
                  error={errors.text}
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

CommentForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { addComment })(CommentForm);
