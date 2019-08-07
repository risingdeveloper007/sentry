import {Flex} from 'grid-emotion';
import {browserHistory} from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';

import BreadcrumbDropdown from 'app/views/settings/components/settingsBreadcrumb/breadcrumbDropdown';
import IdBadge from 'app/components/idBadge';
import MenuItem from 'app/views/settings/components/settingsBreadcrumb/menuItem';
import SentryTypes from 'app/sentryTypes';
import TextLink from 'app/components/links/textLink';
import findFirstRouteWithoutRouteParam from 'app/views/settings/components/settingsBreadcrumb/findFirstRouteWithoutRouteParam';
import recreateRoute from 'app/utils/recreateRoute';
import withLatestContext from 'app/utils/withLatestContext';

class OrganizationCrumb extends React.Component {
  static propTypes = {
    organizations: PropTypes.array,
    organization: SentryTypes.Organization,
    routes: PropTypes.array,
    route: PropTypes.object,
  };

  handleSelect = item => {
    const {params, routes, route} = this.props;
    // If we are currently in a project context, and we're attempting to switch organizations,
    // then we need to default to index route (e.g. `route`)
    //
    // Otherwise, find the last route without a router param
    // e.g. if you are on API details, we want the API listing
    // This fails if our route tree is not nested
    const hasProjectParam = !!params.projectId;
    const destination = hasProjectParam
      ? route
      : findFirstRouteWithoutRouteParam(routes.slice(routes.indexOf(route)));

    browserHistory.push(
      recreateRoute(destination, {
        routes,
        params: {...params, orgId: item.value},
      })
    );
  };

  render() {
    const {organizations, organization, params, routes, route, ...props} = this.props;

    if (!organization) {
      return null;
    }

    const hasMenu = organizations.length > 1;

    return (
      <BreadcrumbDropdown
        name={
          <TextLink
            to={recreateRoute(route, {
              routes,
              params: {...params, orgId: organization.slug},
            })}
          >
            <Flex align="center">
              <IdBadge avatarSize={18} organization={organization} />
            </Flex>
          </TextLink>
        }
        onSelect={this.handleSelect}
        hasMenu={hasMenu}
        route={route}
        items={organizations.map(org => ({
          value: org.slug,
          label: (
            <MenuItem>
              <IdBadge organization={org} />
            </MenuItem>
          ),
        }))}
        {...props}
      />
    );
  }
}

export {OrganizationCrumb};
export default withLatestContext(OrganizationCrumb);