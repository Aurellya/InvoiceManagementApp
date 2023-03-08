import React from "react";

const ComponentToPrint = React.forwardRef((props, ref) => {
  const { invoice, theme } = props;

  return (
    <div className="relative">
      <style
        type="text/css"
        media="print"
        dangerouslySetInnerHTML={{
          __html: `
            // @page { 
            //     size: portrait;
            // }

            @page {
                margin: 10mm 10mm 10mm 10mm;
            }
    `,
        }}
      />

      <div id="pdf" ref={ref}>
        <div id="header" className="text-[1.3rem]">
          <h1>
            <b>
              {theme.language === "Bahasa" ? "Nomor Nota: " : "Invoice No: "}
            </b>
            {invoice._id}
          </h1>
          <h1>
            <b>
              {theme.language === "Bahasa"
                ? "Nama Pelanggan: "
                : "Customer Name: "}
            </b>
            {invoice.customer_name}
          </h1>
          <h1>
            <b>{theme.language === "Bahasa" ? "Tanggal: " : "Date: "}</b>{" "}
            {invoice.date.substring(0, 10)}
          </h1>
        </div>

        <div className="content text-[1.2rem]">
          <div className="mt-4 w-fit">
            <div className="w-full flex items-center justify-end my-4">
              <div className="flex items-center justify-between flex-row gap-10">
                <p className="pt-2">
                  <b>
                    {theme.language === "Bahasa"
                      ? "Jenis Barang: "
                      : "Total Products: "}
                  </b>
                  {invoice.total_items ? invoice.total_items : "-"}
                </p>
                <p className="border border-black pt-2 pb-1 px-4 text-[1.3rem]">
                  <b>Total: </b>
                  {invoice.total
                    ? invoice.total.toLocaleString("en-US", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      })
                    : "-"}
                </p>
              </div>
            </div>

            {/* table */}
            <div className="overflow-auto rounded-lg">
              <table className="border border-y-gray-200">
                <thead className={`bg-gray-50 border-b-2 border-gray-200`}>
                  <tr>
                    <th className="p-3 font-semibold tracking-wide text-left">
                      {theme.language === "Bahasa" ? "Jumlah" : "Quantity"}
                    </th>
                    <th className="p-3 font-semibold tracking-wide text-left">
                      {theme.language === "Bahasa"
                        ? "Nama Barang"
                        : "Item Name"}
                    </th>
                    <th className="p-3 font-semibold tracking-wide text-left">
                      {theme.language === "Bahasa"
                        ? "Harga (/Unit)"
                        : "Price (/Unit)"}
                    </th>
                    <th className="p-3 font-semibold tracking-wide text-left">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {invoice.contents.map((content, i) => (
                    <tr
                      className={`bg-white text-gray-700`}
                      key={invoice._id + "-" + i}
                    >
                      <td className="p-3 whitespace-nowrap">
                        {content.amount + " "}
                        {theme.language === "Bahasa"
                          ? content.unit
                          : content.unit == "bh"
                          ? "pcs"
                          : content.unit == "ls"
                          ? "doz"
                          : content.unit == "grs"
                          ? "gro"
                          : "box"}
                      </td>
                      <td className="p-3 min-w-[360px] break-words">
                        {content.item_name}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {content.price_per_item.toLocaleString("en-US", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        })}{" "}
                        /
                        {theme.language === "Bahasa"
                          ? content.price_unit
                          : content.price_unit == "bh"
                          ? "pcs"
                          : content.price_unit == "ls"
                          ? "doz"
                          : content.price_unit == "grs"
                          ? "gro"
                          : "box"}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {content.total.toLocaleString("en-US", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ComponentToPrint.displayName = "ComponentToPrint";

export default ComponentToPrint;
