import type { DeviceHealthRow } from '../types/event'
import { formatViewers, levelLabel } from '../utils/slo'
import './DeviceHealth.css'

interface Props {
  devices: DeviceHealthRow[]
}

export function DeviceHealth({ devices }: Props) {
  return (
    <section className="devices" aria-labelledby="devices-heading">
      <div className="panel-head">
        <h2 id="devices-heading">Device health</h2>
        <p>Where pain shows up first — CTV and Android often lead.</p>
      </div>

      <div className="devices__table-wrap">
        <table className="devices__table">
          <thead>
            <tr>
              <th scope="col">Platform</th>
              <th scope="col">Viewers</th>
              <th scope="col">Startup</th>
              <th scope="col">Rebuffer</th>
              <th scope="col">Errors</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((row) => (
              <tr key={row.platform} className={`devices__row devices__row--${row.level}`}>
                <th scope="row">{row.label}</th>
                <td>{formatViewers(row.concurrentViewers)}</td>
                <td>{row.startupMs.toLocaleString()} ms</td>
                <td>{row.bufferRatio.toFixed(2)}%</td>
                <td>{row.errorRate.toFixed(2)}%</td>
                <td>
                  <span className={`devices__status devices__status--${row.level}`}>
                    {levelLabel(row.level)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
