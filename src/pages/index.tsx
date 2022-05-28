import { useEffect } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router";
import { ApiGet } from "../helper/API/ApiData";
import AuthStorage from "../helper/AuthStorage";
import Layouts from "../layouts/Layouts";
import LogRegLayout from "../layouts/LogRegLayout";
import { changeLoginState } from "../redux/actions/loginAction";
import Login from "./login/Login";
import MemberManagement from "./member/MemberManagement";
import MemberMngment from "./termination/MemberMngment";
import MemberRegistration from "./member/MemberRegistration";
import MemorialHallManagement from "./memorial-hall-list/memorialHallManagement";
import MemorialHallRegistration from "./memorial-hall-list/memorial-hall-registration/MemorialHallRegistration";
import MemorialHallDetails from "./memorial-hall-list/memorial-hall-detail/memorial-hall-details";
import ConsultationListManagement from "./consultation/ConsultationListManagement";
import ConsultationDetails from "./consultation/ConsultationDetails";
import FuneralNewsManagement from "./funeral-news/FuneralNewsManagement";
import FuneralDetails from "./funeral-news/FuneralDetails";

const Index = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);

  useEffect(() => {
    if (AuthStorage.isUserAuthenticated()) {
      ApiGet("admin/validate")
        .then((res) => {
          dispatch(changeLoginState(true));
          // history.push("/dashboard");
        })
        .catch((error) => {
          AuthStorage.deauthenticateUser();
          history.push("/login");
        });
    } else {
      dispatch(changeLoginState(false));
      AuthStorage.deauthenticateUser();
      history.push("/login");
    }
  }, []);

  return (
    <>
      <Switch>
        {!is_loggedin ? (
          <RouteWrapper
            exact={true}
            path="/login"
            component={Login}
            layout={LogRegLayout}
            isPrivateRoute={false}
          />
        ) : (
          <>
            <RouteWrapper
              exact={true}
              path="/"
              component={MemberManagement}
              layout={Layouts}
              isPrivateRoute={true}
            />
            <RouteWrapper
              exact={true}
              path="/member/member-list"
              component={MemberManagement}
              layout={Layouts}
              isPrivateRoute={true}
            />
            <RouteWrapper
              exact={true}
              path="/member/member-registration"
              component={MemberRegistration}
              layout={Layouts}
              isPrivateRoute={true}
            />
            <RouteWrapper
              exact={true}
              path="/member/management"
              component={MemberMngment}
              layout={Layouts}
              isPrivateRoute={true}
            />
            <RouteWrapper
              exact={true}
              path="/hall/memorial-hall-list"
              component={MemorialHallManagement}
              layout={Layouts}
              isPrivateRoute={true}
            />
            <RouteWrapper
              exact={true}
              path="/hall/memorial-hall-registration"
              component={MemorialHallRegistration}
              layout={Layouts}
              isPrivateRoute={true}
            />
            <RouteWrapper
              exact={true}
              path="/hall/memorial-hall-details"
              component={MemorialHallDetails}
              layout={Layouts}
              isPrivateRoute={true}
            />
            <RouteWrapper
              exact={true}
              path="/other/consultation/consultation-list-management"
              component={ConsultationListManagement}
              layout={Layouts}
              isPrivateRoute={true}
            />
            <RouteWrapper
              exact={true}
              path="/other/consultation/consultation-details"
              component={ConsultationDetails}
              layout={Layouts}
              isPrivateRoute={true}
            />
            <RouteWrapper
              exact={true}
              path="/other/funeral-news/funeral-news-management"
              component={FuneralNewsManagement}
              layout={Layouts}
              isPrivateRoute={true}
            />
            <RouteWrapper
              exact={true}
              path="/other/funeral-news/funeral-details"
              component={FuneralDetails}
              layout={Layouts}
              isPrivateRoute={true}
            />
            <RouteWrapper
              exact={true}
              path="/member/member-registration/:id"
              component={MemberRegistration}
              layout={Layouts}
              isPrivateRoute={true}
            />
            <RouteWrapper
              exact={true}
              path="/hall/memorial-hall-registration/:id"
              component={MemorialHallRegistration}
              layout={Layouts}
              isPrivateRoute={true}
            />
            <RouteWrapper exact={true} path="/hall/memorial-hall-details/:id" component={MemorialHallDetails} layout={Layouts} isPrivateRoute={true} />

            {/* <Redirect from="/" to="/member/member-list" /> */}
          </>
        )}
      </Switch>
    </>
  );
};

export default Index;

interface RouteWrapperProps {
  component: any;
  layout: any;
  exact: boolean;
  path: string;
  isPrivateRoute: boolean;
}

function RouteWrapper({
  component: Component,
  layout: Layout,
  isPrivateRoute,
  ...rest
}: RouteWrapperProps) {
  const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);
  const history = useHistory();
  const isAuthenticated: boolean = isPrivateRoute
    ? is_loggedin
    : true;
  return (
    <>
      {isAuthenticated ? (
        <Route
          {...rest}
          render={(props) => (
            <Layout>
              <Component {...props} />
            </Layout>
          )}
        />
      ) : (
        history.push("/login")
      )}
    </>
  );
}
