import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Tab } from "@headlessui/react";
import { CogIcon, LogoutIcon } from "@heroicons/react/solid";
import Avatar from "../components/atoms/Avatar";
import StackTemplate from "../components/templates/StackTemplate";
import ChangeUserNameForm from "../components/organisms/user/ChangeUserNameForm";
import ChangeUserEmailForm from "../components/organisms/user/ChangeUserEmailForm";
import ChangeUserPasswordForm from "../components/organisms/user/ChangeUserPasswordForm";
import DeleteUserForm from "../components/organisms/user/DeleteUserForm";
import { fetchPrincipal } from "../api/auth";
import authSlice from "../store/slices/auth";

export default function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const principal = useSelector((state) => state.auth.principal);

  const [, setLoading] = useState(false);
  const [, setError] = useState(null);

  const onFetchPrincipal = async () => {
    setLoading(true);
    setError(null);

    try {
      const principalRes = await fetchPrincipal(principal.username);
      dispatch(authSlice.actions.setPrincipal(principalRes.data));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate("/logout");
      } else {
        setError("An unexpected error occurred, please retry!");
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Twaddle Web | Settings";
  }, []);

  return (
    <StackTemplate>
      <div className="h-full bg-white dark:bg-gray-600">
        <div className="xl:container mx-auto p-4">
          <Tab.Group
            as="div"
            className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8"
          >
            <div className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5 flex flex-col space-y-6">
              <div className="w-full flex space-x-4 items-center max-w-full text-gray-800 dark:text-white">
                <div className="bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-white p-2 rounded-full">
                  <div className="h-10 aspect-square rounded-md">
                    <Avatar value={principal.username} />
                  </div>
                </div>
                <div className="space-y-1 max-w-full overflow-hidden">
                  <span className="block text-lg truncate">
                    {principal.username}
                  </span>
                  <span className="block text-xs">Your personal account</span>
                </div>
              </div>
              <Tab.List className="rounded-xl w-full text-gray-700 dark:text-gray-200 space-y-4">
                <Tab
                  className={({ selected }) =>
                    `w-full flex items-center space-x-2 text-sm leading-5 font-medium outline-none pl-1 border-l-4
                      ${selected ? "border-l-amber-500" : "border-transparent"}`
                  }
                >
                  {({ selected }) => (
                    <div
                      className={`truncate w-full h-full flex items-center rounded-lg p-2 text-gray-800 dark:text-white ${
                        selected
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "hover:bg-gray-100 hover:dark:bg-gray-700"
                      }`}
                    >
                      <CogIcon className="h-6" />
                      <div className="ml-2 truncate">User</div>
                    </div>
                  )}
                </Tab>
                <hr />
                <Link
                  to="/logout"
                  className="group relative py-2 px-3 text-sm font-medium rounded-md outline-none hover:brightness-110 disabled:opacity-50 w-full flex justify-center space-x-2 bg-transparent border border-red-500 text-red-500 focus:outline-red-500"
                >
                  <div>Logout</div>
                  <LogoutIcon className="h-6 w-6" aria-hidden="true" />
                </Link>
              </Tab.List>
            </div>
            <Tab.Panels as="div" className="w-full md:w-2/3 lg:w-3/4 xl:w-4/5">
              <Tab.Panel>
                <div className="space-y-8">
                  <ChangeUserNameForm
                    username={principal.username}
                    currentFirstName={principal?.firstName}
                    currentLastName={principal?.lastName}
                    onChange={() => onFetchPrincipal()}
                  />
                  <ChangeUserEmailForm
                    username={principal.username}
                    currentEmail={principal?.email}
                    onChange={() => onFetchPrincipal()}
                  />
                  <ChangeUserPasswordForm username={principal.username} />
                  <DeleteUserForm
                    username={principal.username}
                    onChange={() => navigate("/logout")}
                  />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </StackTemplate>
  );
}
