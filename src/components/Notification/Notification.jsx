import { notification } from 'antd';

// notification
export const Notification = (
   message = t('informationSaved'),
   placement = 'bottomRight',
   type = 'success',
   time = 3,
) => {
   return notification[type]({
      message: message,
      placement,
      duration: time,
   });
};
