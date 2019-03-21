import * as React from "react";
import { isNotNull } from "../../../../isomorphism/fun";

export interface RouteProps {
  route?: {
    hashQuery: any[];
    path: any;
  };
}

interface HashRouteProviderProps {
  hashQuery: string[];
  path: any;
}

/**
 * 简单的Hash路由Context Api
 *    第一个hash路径为path - path
 *    除第一个hash路径外的path为参数 - hashQuery
 *    例如 #detail/10/30 , 则 path: 'detail',  hashQuery: [10, 30]
 * @type {React.Context<HashRouteProviderProps>}
 */
const HashRouteContext = React.createContext<HashRouteProviderProps>(null);

export const withHashRoute = (Component): any => props => (
  <HashRouteContext.Consumer>
    {({ hashQuery, path }) => {
      return <Component {...props} route={{ path, hashQuery }} />;
    }}
  </HashRouteContext.Consumer>
);

export const withHashRouteProvider = (Component): any =>
  class MultiLangProvider extends React.PureComponent<HashRouteProviderProps, HashRouteProviderProps> {
    constructor(props) {
      super(props);
      this.state = {
        hashQuery: null,
        path: null
      };
    }

    getHashParameters = () => {
      let { hash } = window.location;
      hash = hash.indexOf("#") > -1 ? hash.substring(1) : hash;
      hash = hash.indexOf("?") > -1 ? hash.substring(0, hash.indexOf("?")) : hash;
      hash = hash.indexOf("&") > -1 ? hash.substring(0, hash.indexOf("&")) : hash;
      const parts = hash.split("/").filter(isNotNull);
      parts.shift(); // removes first part
      return parts;
    };
    getHash = () => {
      let { hash } = window.location;
      hash = hash.indexOf("#") > -1 ? hash.substring(1) : hash;
      hash = hash.indexOf("?") > -1 ? hash.substring(0, hash.indexOf("?")) : hash;
      hash = hash.indexOf("&") > -1 ? hash.substring(0, hash.indexOf("&")) : hash;
      const parts = hash.split("/").filter(isNotNull); // separates hash parameters
      return parts[0]; // removes leading #
    };
    hashChangeHandler = () => {
      const path = this.getHash();
      const hashQuery = this.getHashParameters();
      this.setState({
        path,
        hashQuery
      });
    };

    componentWillMount() {
      this.hashChangeHandler();
      window.addEventListener("hashchange", this.hashChangeHandler);
    }

    componentWillUnmount() {
      window.removeEventListener("hashchange", this.hashChangeHandler);
    }

    render() {
      return (
        <HashRouteContext.Provider value={this.state}>
          <Component {...this.props} />
        </HashRouteContext.Provider>
      );
    }
  };
