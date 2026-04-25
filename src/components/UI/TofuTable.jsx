import './TofuTable.css';

export default function TofuTable({ columns, data, onRowClick, emptyText = '目前沒有資料', actions }) {
  if (!data?.length) {
    return (
      <div className="tofu-table-empty">
        <span className="tofu-table-empty__icon">📭</span>
        <p>{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="tofu-table-wrapper">
      <table className="tofu-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width, minWidth: col.minWidth }}>
                {col.label}
              </th>
            ))}
            {actions && <th style={{ width: '120px' }}>操作</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.rowIndex || idx}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'tofu-table__clickable' : ''}
            >
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row, idx) : (row[col.key] ?? '')}
                </td>
              ))}
              {actions && (
                <td className="tofu-table__actions">
                  {actions(row, idx)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
