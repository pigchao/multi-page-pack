import { StyledComponentProps } from "@material-ui/styles/withStyles";
import React, { ReactElement } from "react";
import { withStyles } from "@material-ui/styles";
import classNames from "classnames";

const styles = {
  default: {
    position: "relative" as "relative",
    "&:after": {
      content: '""',
      position: "absolute" as "absolute",
      top: "-50%",
      left: "-50%",
      right: "-50%",
      bottom: "-50%",
      borderWidth: 0,
      borderColor: "#D9DFE8",
      borderStyle: "solid",
      transform: "scale(0.5)",
      pointerEvents: "none" as "none"
    }
  },
  all: {
    "&:after": {
      borderWidth: "1px"
    }
  },
  top: {
    "&:after": {
      borderTopWidth: 1
    }
  },
  bottom: {
    "&:after": {
      borderBottomWidth: 1
    }
  },
  left: {
    "&:after": {
      borderLeftWidth: 1
    }
  },
  right: {
    "&:after": {
      borderRightWidth: 1
    }
  }
};

interface IHalfBorder {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  none?: boolean;
  style?: string;
  className?: string;
}

@withStyles(styles)
export default class HalfBorder extends React.PureComponent<IHalfBorder & StyledComponentProps> {
  render() {
    const { classes, top, bottom, left, right, none, children } = this.props;
    const allNeed = !(top || bottom || left || right);
    const child = React.Children.only(children) as ReactElement<{ className? }>;
    return React.cloneElement(child, {
      className: classNames(child.props.className, classes.default, {
        [classes.all]: allNeed && !none,
        [classes.top]: top && !none,
        [classes.bottom]: bottom && !none,
        [classes.left]: left && !none,
        [classes.right]: right && !none
      })
    });
  }
}
