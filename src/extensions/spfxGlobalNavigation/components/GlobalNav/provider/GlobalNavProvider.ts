import IGlobalNavItem from "../model/IGlobalNavItem";
import ISPGlobalNavItem from "../model/ISPGlobalNavItem";
import "@pnp/polyfill-ie11";
import { sp, Web } from "@pnp/sp";

export default class GlobalNavProvider {
  public async getGlobalNavigation(): Promise<IGlobalNavItem[]> {

    let web = new Web("http://sp2019dev");
    const results = await web.lists
      .getByTitle("Global Nav List")
      .items.select(
        "Title",
        "Id",
        "GlobalNavUrl",
        "GlobalNavOpenInNewWindow",
        "GlobalNavParent/Title",
        "GlobalNavSecured"
      )
      .top(2000)
      .expand("GlobalNavParent/Title")
      .orderBy("GlobalNavOrder")
      .orderBy("Title")
      .get();

    console.log(results);
    return this.parseGlobalNavigationNodes(results);
  }


  private parseGlobalNavigationNodes(spGlobalNavItems: ISPGlobalNavItem[]): Promise<IGlobalNavItem[]> {
    return new Promise((resolve, reject) => {
      let depth: number = 0;
      let globalNavItems: IGlobalNavItem[] = [];
      spGlobalNavItems.forEach(
        (item: ISPGlobalNavItem): void => {
          //if (!item.GlobalNavParent.Title) {
          globalNavItems.push({
            title: item.Title,
            id: item.Id,
            url: item.GlobalNavUrl,
            openInNewWindow: item.GlobalNavOpenInNewWindow,
            subNavItems: this.getSubNavItems(spGlobalNavItems, item.Title, depth + 1),
            level: depth,
            secured: item.GlobalNavSecured
          });
          //}
        }
      );
      resolve(globalNavItems);
    });
  }

  private getSubNavItems(
    spNavItems: ISPGlobalNavItem[],
    filter: string,
    depth: number
  ): IGlobalNavItem[] {
    let subNavItems: IGlobalNavItem[] = [];
    spNavItems.forEach(
      (item: ISPGlobalNavItem): void => {
        if (item.GlobalNavParent != undefined && item.GlobalNavParent.Title === filter) {
          subNavItems.push({
            title: item.Title,
            id: item.Id,
            url: item.GlobalNavUrl,
            openInNewWindow: item.GlobalNavOpenInNewWindow,
            subNavItems: this.getSubNavItems(spNavItems, item.Title, depth + 1),
            level: depth,
            secured: item.GlobalNavSecured
          });
        }
      }
    );
    return subNavItems.length > 0 ? subNavItems : null;
  }
}
