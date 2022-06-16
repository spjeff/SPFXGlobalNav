import * as React from "react";
import IGlobalNavNode from "./model/IGlobalNavNode";
import IGlobalNavItem from "./model/IGlobalNavItem";
import slugify from "slugify";

import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { mergeStyles } from "office-ui-fabric-react";
//initializeIcons();

let iconClass = mergeStyles({
  color: '#00a0f5',

});

export interface IGlobalNavNodeProps extends IGlobalNavNode { }

export default class GlobalNavNode extends React.Component<IGlobalNavNodeProps, {}> {
  public render(): JSX.Element {
    const titleClassName: string = slugify(this.props.globalNavItem.title, { lower: true });
    const caretClassName: string = this.props.globalNavItem.level > 0 ? "ms-Icon--CaretSolidRight" : "ms-Icon--CaretSolidDown";
    return (
      <li
        key={this.props.globalNavItem.id}
        className={this.props.globalNavItem.subNavItems ? `td-dropdown ${titleClassName}` : `${titleClassName}`}
        data-level={this.props.globalNavItem.level}
      >
        <a
          href={this.props.globalNavItem.url || "#"}
          target={this.props.globalNavItem.openInNewWindow ? "_blank" : "_self"}
        >

          {this.props.globalNavItem.title}
          {this.props.globalNavItem.secured && (
            <i className={`vpn-icon ms-Icon ms-Icon--ShieldSolid`} />
          )}
          {this.props.globalNavItem.subNavItems && <i className={`ms-Icon ${caretClassName}`} />}
        </a>
        {this.props.globalNavItem.subNavItems && (
          <ul className="td-dropdown-menu" data-level={this.props.globalNavItem.level + 1}>
            {this.props.globalNavItem.subNavItems.map((globalNavItem: IGlobalNavItem) => (
              <GlobalNavNode key={globalNavItem.id} globalNavItem={globalNavItem} />
            ))}
          </ul>
        )}
      </li>
    );
  }
}
