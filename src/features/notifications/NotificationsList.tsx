import React, { useLayoutEffect } from 'react'
import { formatDistanceToNow, parseISO } from 'date-fns'
import classnames from 'classnames'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectAllUsers } from '@/features/users/usersSlice'

import { allNotificationsRead, useGetNotificationsQuery, selectMetadataEntities } from './notificationsSlice'

const UNKNOWN_USER = {
  name: 'Unknown User',
}

export const NotificationsList = () => {
  const dispatch = useAppDispatch()
  const { data: notifications = [] } = useGetNotificationsQuery()
  const notificationsMetadata = useAppSelector(selectMetadataEntities)
  const users = useAppSelector(selectAllUsers)

  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  })

  const renderedNotifications = notifications.map((notification) => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = users.find((user) => user.id === notification.user) ?? UNKNOWN_USER

    const metadata = notificationsMetadata[notification.id]

    const notificationClassname = classnames('notification', {
      new: metadata.isNew,
    })

    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}
