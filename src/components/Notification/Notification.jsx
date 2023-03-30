import { notification } from 'antd';

// notification
export const Notification = (
   message = 'Информация сохранена',
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
