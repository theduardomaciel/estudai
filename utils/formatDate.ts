export default function formatDate(date: Date, removeYear?: boolean) {
	const day = date.getDate() + 1;
	const month = date.getMonth() + 1;
	return removeYear
		? `${day.toString().length === 1 ? `0${day}` : day}/${
				month.toString().length === 1 ? `0${month}` : month
		  }`
		: `${day.toString().length === 1 ? `0${day}` : day}/${
				month.toString().length === 1 ? `0${month}` : month
		  }/${date.getFullYear()}`;
}
