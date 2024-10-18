import { UserModel } from "../../lib/schemas/user.schema";

export async function addNotification(userId: string, newNotification: string) {
    const user = await UserModel.findById(userId);
    if (user) {
      if (user.notifications.length >= 3) {
        user.notifications.shift(); // Remove the oldest notification
      }
      user.notifications.push(newNotification); // Add the new notification
      await user.save();
    }
  }

export default async function displayNotifications(userId: string | undefined){
  const user = await UserModel.findById(userId);

  if (user) {
    user.notifications.length == 0 ? (
      <div tabIndex={0} className="collapse bg-base-200">
        <button className="btn btn-primary collapse-title text-lg font-medium">Notifications</button>
        <div className="collapse-content">
          <p>No notifications</p>
        </div>
      </div>
    ) 
    : 
    (
      <div tabIndex={0} className="collapse bg-base-200">
        <button className="btn btn-primary collapse-title text-lg font-medium">Notifications</button>
        <div className="collapse-content">
            {user.notifications.map((notification, index) => (
              <div key={index}>
                <p>{notification}</p>
            </div>
            ))}
        </div>
      </div>)
      
  } else {
    return null;
  }

}