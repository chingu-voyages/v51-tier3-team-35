import { UserNotification } from "../../../lib/models/user-notification.model";

// The general idea of this class is to format the notification based on the notification type into some kind react component
export class NotificationFactory {
  public generate(userNotification: UserNotification): JSX.Element | null {
    switch (userNotification.notificationType) {
      case "addToAdventure":
        return this.createAddToAdventureNotification(userNotification);
      default:
        return this.createDefaultNotification(
          userNotification as unknown as string
        );
    }
  }

  private createAddToAdventureNotification(
    userNotification: UserNotification
  ): JSX.Element {
    // Format is "url[sourceUser.name] added you to an url[adventure]"
    return (
      <div key={userNotification._id} className="text-neutral-600 text-sm ">
        <p>
          {userNotification.sourceUser.name} added you to{" "}
          <a href={userNotification.link?.href}>
            {userNotification.link?.label}
          </a>
        </p>
      </div>
    );
  }

  private createDefaultNotification(userNotification: string): JSX.Element {
    // the notification is a string
    return <p>{userNotification}</p>;
  }
}
