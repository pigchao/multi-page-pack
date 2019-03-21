import React, { ReactNode } from "react";
import { hidePrompt, showPrompt } from "../components/Prompt";

interface JumpingProps {
  render: ({ onJump }) => ReactNode;
  text?: string;
}

export default class Jumping extends React.PureComponent<JumpingProps> {
  static defaultProps = {
    text: "Loading..."
  };

  componentWillUnmount() {
    this.hideLoading();
  }

  onJump = (onClick: () => string | Promise<string>) => async () => {
    const result = onClick();
    const url = typeof result === "string" ? result : await result;
    if (typeof url !== "string") {
      return;
    }
    showPrompt({ content: this.props.text, loading: true });
    setTimeout(() => (window.location.href = url), 500);
    window.addEventListener("unload", this.hideLoading);
  };

  hideLoading = () => {
    hidePrompt();
    window.removeEventListener("unload", this.hideLoading);
  };

  render() {
    const { render } = this.props;
    return render({ onJump: this.onJump });
  }
}
