import {
  Notification,
  NotificationDesign,
  NotificationType,
} from "../types/mainTypes";

export class NotificationBuilder {
  static build<T>(
    design: NotificationDesign,
    notification: Notification
  ): string {
    const {
      title,
      assetName,
      assetImageUrl,
      header: { message, subMessage },
      rowData,
    } = notification;

    const { outerHtml, rowBlockHtml, css } = design;

    let dynamicRowHtml = "";

    for (const row of rowData) {
      const [fieldName, fieldData] = Object.entries(row)[0];
      let rowHtml = rowBlockHtml;

      for (const [placeholder, value] of Object.entries(fieldData)) {
        rowHtml = rowHtml.replace(`{{ ${placeholder} }}`, value as any);
      }

      rowHtml = rowHtml
        .replace("{{ value }}", fieldData.value)
        .replace("{{ subValue }}", fieldData.subValue);

      dynamicRowHtml += rowHtml.replace("{{ heading }}", fieldData.label);
    }

    const completeHtml = outerHtml
      .replace("{{ notificationTitle }}", title)
      .replace("{{ notificationAssetName }}", assetName)
      .replace("{{ notificationAssetImageUrl }}", assetImageUrl)
      .replace("{{ notificationAlertMainHeaderMessage }}", message)
      .replace("{{ notificationAlertMainHeadeSubMessage }}", subMessage)
      .replace("{{ innerRows }}", dynamicRowHtml);

    return `<style>${css}</style>` + completeHtml;
  }
}

const nftNotificationExample: Notification = {
  title: "NFT Projects (Big Changes)",
  assetName: "CRYPTOPUNKS",
  assetImageUrl:
    "https://lh3.googleusercontent.com/MjB7F6hrzm09mRsiqZ0A63XeDIuTUKTLzer9Ekoe7OTFiAKA7DZKD8fz9pBt8Pfq1Cecvs4Kxm_oEpujI_LXi9604BeWW2sMHpw=s1000",
  type: NotificationType.NFT,
  header: {
    message: "44.07 ETH",
    subMessage: "(+17.03% 1m)",
  },
  rowData: [
    {
      floorPrice1h: {
        label: "Floor Price - 1H",
        value: "(+2.01%)",
        subValue: "$2,342",
      },
    },
    {
      floorPrice24h: {
        label: "Floor Price - 24H",
        value: "(+3.22%)",
        subValue: "$5,433)",
      },
    },
    {
      floorPrice30d: {
        label: "Floor Price - 30d",
        value: "(+27.22%)",
        subValue: "$14,2322",
      },
    },
    {
      listingsPastDay: {
        label: "Listings in past day",
        value: "4 (+2)",
        subValue: "50.3%",
      },
    },
  ],
};
