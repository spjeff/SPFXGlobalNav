import * as React from "react";
import * as ReactDom from "react-dom";
import { override } from "@microsoft/decorators";
import { Log } from "@microsoft/sp-core-library";
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from "@microsoft/sp-application-base";
import GlobalNav from "./components/GlobalNav/GlobalNav";
//import * as strings from "SpfxGlobalNavigationApplicationCustomizerStrings";
import { sp } from "@pnp/sp";

const LOG_SOURCE: string = "SpfxGlobalNavigationApplicationCustomizer";

export interface ISpfxGlobalNavigationApplicationCustomizerProperties { }

export default class SpfxGlobalNavigationApplicationCustomizer extends BaseApplicationCustomizer<
  ISpfxGlobalNavigationApplicationCustomizerProperties
> {
  private topPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized SpfxGlobalNavigationApplicationCustomizer`);

    // sp.setup({
    //   spfxContext: this.context
    // });

    sp.setup({
      sp: {
        headers: {
          Accept: "application/json;odata=verbose"
        },
        baseUrl: `http://sp2019dev/`
      }
    });

    this.context.placeholderProvider.changedEvent.add(
      this,
      this.renderPlaceHolders
    );

    return Promise.resolve();
  }

  private renderPlaceHolders(): void {
    if (!this.topPlaceholder) {
      this.topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top
      );

      if (!this.topPlaceholder) {
        return;
      }

      if (this.topPlaceholder.domElement) {
        const element: React.ReactElement<{}> = React.createElement(
          GlobalNav,
          {}
        );
        ReactDom.render(element, this.topPlaceholder.domElement);
      }
    }
  }
}
